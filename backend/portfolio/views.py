from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from portfolio.filters import PortfolioFilter
from portfolio.models import PortfolioModel
from portfolio.serializers import PortfolioSerializer
from utils.pagination import StandardPagination
from utils.permissions import IsAdminOrReadOnly
from utils.swagger_doc import many_delete_swagger


class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = PortfolioModel.objects.filter(is_deleted=False)
    serializer_class = PortfolioSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardPagination

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = PortfolioFilter

    search_fields = ['id', 'title_tr', 'title_en', 'title_ar']
    ordering_fields = ['id', 'is_active']
    ordering = ['-pk']

    def get_queryset(self):
        order_by = self.request.query_params.get('order_by', '-id')
        return PortfolioModel.objects.filter(is_deleted=False).order_by(order_by)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()

    @many_delete_swagger
    @action(methods=['delete'], detail=False, permission_classes=[IsAdminUser])
    def many_delete(self, request):
        ids = request.data.get('ids')
        if not isinstance(ids, list):
            return Response({'detail': 'Invalid data format: identities should be a list.'},
                            status=status.HTTP_400_BAD_REQUEST)

        PortfolioModel.objects.filter(id__in=ids).delete()
        return Response({'detail': 'The selected portfolios have been successfully deleted.'},
                        status=status.HTTP_204_NO_CONTENT)
