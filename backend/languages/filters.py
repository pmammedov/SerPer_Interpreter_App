import django_filters
from django_filters import BooleanFilter, NumberFilter

from languages.models import Languages


class LanguagesFilter(django_filters.FilterSet):
    is_active = BooleanFilter(field_name='is_active')
    order = NumberFilter(field_name='order')

    class Meta:
        model = Languages
        fields = []
