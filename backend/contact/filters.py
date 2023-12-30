import django_filters
from django_filters import BooleanFilter, CharFilter

from contact.models import ContactMessage


class ContactMessageFilter(django_filters.FilterSet):
    title = CharFilter(field_name='title', lookup_expr='icontains')
    email = CharFilter(field_name='email', lookup_expr='icontains')
    is_active = BooleanFilter(field_name='is_active')
    is_reply = BooleanFilter(field_name='is_reply')

    class Meta:
        model = ContactMessage
        fields = []
