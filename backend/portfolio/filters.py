import django_filters
from django_filters import BooleanFilter

from portfolio.models import PortfolioModel


class PortfolioFilter(django_filters.FilterSet):
    is_active = BooleanFilter(field_name='is_active')

    class Meta:
        model = PortfolioModel
        fields = []
