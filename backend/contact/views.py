import os

from django.core.mail import send_mail
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from contact.filters import ContactMessageFilter
from contact.models import ContactMessage
from contact.serializers import ContactMessageSerializer, ContactMessageReplySerializer
from utils.pagination import StandardPagination
from utils.permissions import IsAdminOrPostOnly
from utils.swagger_doc import many_delete_swagger


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminOrPostOnly]
    pagination_class = StandardPagination
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = ContactMessageFilter

    search_fields = ['id', 'title', 'first_name', 'last_name', 'email']
    ordering_fields = ['id', 'is_active', 'is_reply', 'reply_at', 'created_at']
    ordering = ['-id']

    def get_queryset(self):
        order_by = self.request.query_params.get('order_by', '-id')
        if self.request.user and self.request.user.is_staff:
            # All messages for admin users
            return ContactMessage.objects.all().order_by(order_by)
        else:
            # Only active and undeleted messages for other users
            return ContactMessage.objects.filter(is_active=True, is_deleted=False).order_by(order_by)

    def perform_create(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super(ContactMessageViewSet, self).update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()

    @many_delete_swagger
    @action(methods=['delete'], detail=False, permission_classes=[IsAdminUser])
    def many_delete(self, request):
        ids = request.data.get('ids')
        if not isinstance(ids, list):
            return Response({'detail': 'Invalid data format: messages should be a list.'},
                            status=status.HTTP_400_BAD_REQUEST)

        ContactMessage.objects.filter(id__in=ids).delete()
        return Response({'detail': 'Selected messages have been successfully deleted.'},
                        status=status.HTTP_204_NO_CONTENT)


class ContactMessageReplyView(generics.UpdateAPIView):
    queryset = ContactMessage.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ContactMessageReplySerializer

    def update(self, request, *args, **kwargs):
        contact_message = self.get_object()
        reply_message = request.data.get('reply_message')

        # Email sending process
        send_mail(
            subject=f'Re: {contact_message.title}',
            message=reply_message,
            from_email=os.getenv("EMAIL_HOST_USER"),
            recipient_list=[contact_message.email],
            fail_silently=False,
        )

        # Saving the response to the database
        contact_message.reply = reply_message
        contact_message.reply_at = timezone.now()
        contact_message.reply_by = request.user
        contact_message.is_reply = True
        contact_message.save()

        return Response({'status': True,
                         'message': 'Your message has been sent successfully.'})
