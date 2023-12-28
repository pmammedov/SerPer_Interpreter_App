from datetime import timedelta, datetime

from django.contrib.auth.hashers import make_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from user.models import UserModel
from utils.functions import send_email


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = ('email', 'password', 'full_name')

    def create(self, validated_data):
        email = validated_data.get('email')
        full_name = validated_data.get('full_name')
        password = validated_data.get('password')

        user = UserModel.objects.create(
            email=email,
            full_name=full_name,
            username=email,
            password=make_password(password)
        )
        return user


class UserVerifySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'is_active', 'full_name', 'token')


class LoginSerializer(TokenObtainPairSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = ('email', 'password')

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = UserModel.objects.filter(email=email).first()

        # If the user cannot be found.
        if user is None:
            raise AuthenticationFailed({"status": False, "message": "The email address could not be found."})

        # If the user's status value is not appropriate.
        if user.status not in [1, 2]:
            raise AuthenticationFailed({"status": False, "message": "You do not have the appropriate permissions for this operation."})

        if user.login_attempt > 5:
            user.is_active = False
            expiration_date = datetime.now() + timedelta(hours=1)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            user.password_reset_expiration = expiration_date
            send_email(
                subject='"Password Reset"',
                template_name='emailtemplates/reset-password.html',
                context={'frontend_url': 'https://localhost:3000/activate', 'uid': uid, 'token': token},
                user_email=user.email
            )
            user.save()
            raise AuthenticationFailed({"status": False,
                                        "message": "Your account has been blocked. Please follow the password reset instructions sent to your email."})

        if not user.check_password(password):
            remaining_attempts = 5 - user.login_attempt
            user.login_attempt += 1
            user.save()
            raise AuthenticationFailed(
                {"status": False, "message": f"Wrong Password. {remaining_attempts} you have remaining login attempts."})

        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        user.is_active = True
        user.login_attempt = 0
        user.save()
        return data
