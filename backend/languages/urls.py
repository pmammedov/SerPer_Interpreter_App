from django.urls import path, include
from rest_framework.routers import DefaultRouter

from languages.views import LanguagesViewSet

router = DefaultRouter()
router.register(r'', LanguagesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]