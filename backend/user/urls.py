from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user.views import (UserUpdateView, GetUserMeViewSet, ForgetPasswordViewSet, ResetPasswordViewSet,
                        UpdatePasswordView, UserViewSet)

router = DefaultRouter()
router.register(r'superuser', UserViewSet, basename='superuser')

urlpatterns = [
    path("update_profile", UserUpdateView.as_view(), name="update_profile"),
    path("get_me", GetUserMeViewSet.as_view({"get": "list"}), name="get_me"),
    path("forget_password", ForgetPasswordViewSet.as_view({"post": "create"}), name="forget_password"),
    path("reset_password/<uid>/<token>", ResetPasswordViewSet.as_view({"post": "create"}), name="reset_password"),
    path("update_password", UpdatePasswordView.as_view({"put": "update"}), name="update_password"),
    path('', include(router.urls)),
]
