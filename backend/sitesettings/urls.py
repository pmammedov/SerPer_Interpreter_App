from django.urls import path, include
from rest_framework.routers import DefaultRouter

from sitesettings.views import SiteSettingsViewSet

router = DefaultRouter()
router.register(r'', SiteSettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
