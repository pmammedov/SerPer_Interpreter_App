import django_filters
from django_filters import BooleanFilter

from comments.models import Comments


class CommentsFilter(django_filters.FilterSet):
    is_active = BooleanFilter(field_name='is_active')

    class Meta:
        model = Comments
        fields = []
