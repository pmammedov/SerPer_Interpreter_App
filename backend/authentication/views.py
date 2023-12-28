import uuid0
from django.shortcuts import get_object_or_404

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from authentication.serializers import RegisterSerializer, UserVerifySerializer, LoginSerializer
from utils.functions import send_email
from utils.swagger_doc import register_swagger, verify_swagger
from user.models import UserModel as User


class UserRegisterView(APIView):
    serializer_class = RegisterSerializer

    @register_swagger
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = uuid0.generate()
            user.token = token
            user.save()
            send_email(user.email,
                       context={"product": "Interpreter Management System", "frontend_url": "http://localhost:3000",
                                "token": token},
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


class UserVerifyView(APIView):
    serializer_class = UserVerifySerializer
    permission_classes = [permissions.AllowAny]

    @verify_swagger
    def get(self, request, *args, **kwargs):
        token = self.kwargs.get('token')
        user = get_object_or_404(User, token=token)
        user.is_active = True
        user.is_verified = True
        send_email(user.email,
                   context={"product": "Interpreter Management System", "user_name": user.full_name},
                   token=token,
                   template_name="emailtemplates/welcome.html",
                   subject='Interpreter Management System - Email Verification')
        user.save()
        return Response({
            "status": True,
            "message": "Email address verified."
        }, status=status.HTTP_200_OK)


class UserLoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
