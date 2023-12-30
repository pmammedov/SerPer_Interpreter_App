from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from languages.filters import LanguagesFilter
from languages.models import Languages
from languages.serializers import LanguagesSerializer
from utils.pagination import StandardPagination
from utils.permissions import IsAdminOrReadOnly
from utils.swagger_doc import many_delete_swagger


class LanguagesViewSet(viewsets.ModelViewSet):
    queryset = Languages.objects.filter(is_deleted=False)
    serializer_class = LanguagesSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardPagination

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = LanguagesFilter

    search_fields = ['id', 'name_tr', 'name_en', 'name_ar']
    ordering_fields = ['id', 'is_active', 'order']
    ordering = ['-pk']

    def get_queryset(self):
        order_by = self.request.query_params.get('order_by', '-id')
        return Languages.objects.filter(is_deleted=False).order_by(order_by)

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

        Languages.objects.filter(id__in=ids).delete()
        return Response({'detail': 'The selected languages have been successfully deleted.'},
                        status=status.HTTP_204_NO_CONTENT)
