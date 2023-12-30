import uuid
from datetime import datetime, timedelta

from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from user.serializers import (UpdateUserSerializer, GetUserMeSerializer, ForgetPasswordSerializer,
                              ResetPasswordSerializer, UpdatePasswordSerializer, SuperuserSerializer)
from user.models import UserModel as User
from utils.functions import send_email
from utils.pagination import StandardPagination
from utils.permissions import IsSuperAdminUser
from utils.swagger_doc import (update_user_swagger, get_user_me_swagger, forget_password_swagger,
                               reset_password_swagger, update_password_swagger, many_delete_swagger)


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @update_user_swagger
    def get_object(self):
        return self.request.user


class GetUserMeViewSet(viewsets.ViewSet):
    serializer_class = GetUserMeSerializer
    permission_classes = [permissions.IsAuthenticated]

    @get_user_me_swagger
    def list(self, request):
        if request.user.is_authenticated:
            serializer = self.serializer_class(request.user)
            return Response(serializer.data)
        else:
            return Response(
                {"message": "No logged-in user found."},
                status=status.HTTP_404_NOT_FOUND
            )


class ForgetPasswordViewSet(viewsets.ViewSet):
    serializer_class = ForgetPasswordSerializer
    permission_classes = [permissions.AllowAny]

    @forget_password_swagger
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            expiration_date = datetime.now() + timedelta(hours=1)
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            user.password_reset_expiration = expiration_date
            send_email(
                subject='Password Reset',
                template_name='emailtemplates/reset-password.html',
                context={'frontend_url': 'http://localhost:3000/auth/reset-password', 'uid': uid, 'token': token},
                user_email=user.email
            )
            return Response(
                {"message": "The password reset link has been sent to your email address."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "No user found with the provided information."},
                status=status.HTTP_404_NOT_FOUND
            )


class ResetPasswordViewSet(viewsets.ViewSet):
    serializer_class = ResetPasswordSerializer
    permission_classes = [permissions.AllowAny]

    @reset_password_swagger
    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = urlsafe_base64_decode(kwargs.get('uid'))
        token = kwargs.get('token')
        password = serializer.validated_data.get('password')
        password2 = serializer.validated_data.get('password_confirm')

        if password != password2:
            return Response(
                {"status": False, "message": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.get(pk=uid)
        if user is None:
            return Response(
                {"status": False, "message": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"status": False, "message": "Invalid Token."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.login_attempt = 0
        user.is_active = True
        user.save()
        return Response(
            {"status": True, "message": "Your password has been successfully changed."},
            status=status.HTTP_200_OK
        )


class UpdatePasswordView(viewsets.ViewSet):
    serializer_class = UpdatePasswordSerializer

    @update_password_swagger
    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data.get('old_password')
            new_password = serializer.validated_data.get('new_password')

            if not user.check_password(old_password):
                return Response({"status": False,
                                 "message": "Wrong old password."},
                                status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)
            return Response({"status": True,
                             "message": "Password updated successfully."},
                            status=status.HTTP_200_OK)

        return Response({"status": False,
                         "message": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = SuperuserSerializer
    permission_classes = [IsSuperAdminUser]
    pagination_class = StandardPagination

    filter_backends = (SearchFilter, OrderingFilter)

    search_fields = ['id', 'email', 'full_name']
    ordering_fields = ['id', 'status', 'is_active', 'is_deleted', 'is_staff', 'is_superuser', 'created_at']

    def get_queryset(self):
        return User.objects.filter()

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # UUID token oluşturma
            token = uuid.uuid4().hex
            user.token = token
            user.save()

            # Kullanıcıya e-posta gönderme
            send_email(user.email,
                       context={
                           "product": "Interpreter Management System",
                           "frontend_url": "http://localhost:3000",
                           "token": token
                       },
                       template_name="emailtemplates/confirm-email.html",
                       subject='Interpreter Management System - Email Verification')

            return Response({
                "status": True,
                "message": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "status": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"message": "Only superusers can perform this operation."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"message": "Only superusers can perform this operation."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @many_delete_swagger
    @action(methods=['delete'], detail=False, permission_classes=[IsAdminUser])
    def many_delete(self, request):
        ids = request.data.get('ids')
        if not isinstance(ids, list):
            return Response({'detail': 'Invalid data format: identities should be a list.'},
                            status=status.HTTP_400_BAD_REQUEST)

        User.objects.filter(id__in=ids).delete()
        return Response({'detail': 'Selected users have been successfully deleted.'},
                        status=status.HTTP_204_NO_CONTENT)
