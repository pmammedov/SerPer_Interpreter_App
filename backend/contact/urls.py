from django.urls import path, include
from rest_framework.routers import DefaultRouter

from contact.views import ContactMessageViewSet, ContactMessageReplyView

router = DefaultRouter()
router.register(r'', ContactMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/reply/', ContactMessageReplyView.as_view(), name='contact-message-reply'),
]
