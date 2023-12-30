import django_filters
from django_filters import BooleanFilter

from news.models import NewsModel


class NewsFilter(django_filters.FilterSet):
    is_active = BooleanFilter(field_name='is_active')

    class Meta:
        model = NewsModel
        fields = []
