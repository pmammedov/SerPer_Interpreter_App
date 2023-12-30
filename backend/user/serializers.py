from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from user.models import UserModel as User


class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = (
            'email',
            'full_name',
        )

    def update(self, instance, validated_data):
        email = validated_data.get('email')
        if email and email != instance.email:
            if User.objects.filter(email=email).exclude(pk=instance.pk).exists():
                raise ValidationError({"status": False, "message": "Bu e-posta adresi zaten kullanılıyor."})
        instance.full_name = validated_data.get('full_name', instance.full_name)
        email = validated_data.get('email', instance.email)
        instance.email = email
        instance.username = email
        instance.save()

        return instance


class GetUserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'full_name',
            'status'
        )


class ForgetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ('email',)

    def validate_email(self, email):
        if not User.objects.filter(email=email).exists():
            raise ValidationError({"status": False, "message": "Hesabınıza ait olan e-posta adresinizi giriniz"})
        return email


class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField()
    password_confirm = serializers.CharField()

    class Meta:
        model = User
        fields = ('password', 'password_confirm')

    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')

        if password != password_confirm:
            raise ValidationError({"status": False, "message": "Şifreler eşleşmiyor."})

        return attrs


class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password_repeat = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_repeat']:
            raise serializers.ValidationError("Passwords must match.")
        return data


class SuperuserSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M", read_only=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'full_name',
            'status',
            'is_superuser',
            'created_at',
            'password',
        )
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['email'],
            full_name=validated_data['full_name'],
            status=validated_data['status'],
            is_superuser=validated_data['is_superuser'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        # E-posta güncellemesi
        email = validated_data.get('email', instance.email)
        if email != instance.email:
            if User.objects.filter(email=email).exclude(pk=instance.pk).exists():
                raise serializers.ValidationError({"email": "Bu e-posta adresi zaten kullanılıyor."})
            instance.email = email
            instance.username = email

        # Diğer alanların güncellenmesi
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.status = validated_data.get('status', instance.status)
        instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)

        instance.save()
        return instance
