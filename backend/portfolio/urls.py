from django.urls import path, include
from rest_framework.routers import DefaultRouter

from portfolio.views import PortfolioViewSet

router = DefaultRouter()
router.register(r'', PortfolioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
