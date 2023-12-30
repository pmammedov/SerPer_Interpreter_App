from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from comments.filters import CommentsFilter
from comments.models import Comments
from comments.serializers import CommentsSerializer
from utils.pagination import StandardPagination
from utils.permissions import IsAdminOrPostOnly
from utils.swagger_doc import many_delete_swagger


class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [IsAdminOrPostOnly]
    pagination_class = StandardPagination
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = CommentsFilter

    search_fields = ['comment', 'email', 'first_name', 'last_name']
    ordering_fields = ['id', 'email', 'is_active', 'created_at']
    ordering = ['-pk']

    def get_queryset(self):
        order_by = self.request.query_params.get('order_by', '-id')
        if self.request.user and self.request.user.is_staff:
            # All comments for admin users
            return Comments.objects.all().order_by(order_by)
        else:
            # Only active and undeleted comments for other users
            return Comments.objects.filter(is_active=True, is_deleted=False).order_by(order_by)

    def perform_create(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super(CommentsViewSet, self).update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.is_deleted = True
        instance.save()

    @many_delete_swagger
    @action(methods=['delete'], detail=False, permission_classes=[IsAdminUser])
    def many_delete(self, request):
        ids = request.data.get('ids')
        if not isinstance(ids, list):
            return Response({'detail': 'Invalid data format: comments should be a list.'},
                            status=status.HTTP_400_BAD_REQUEST)

        Comments.objects.filter(id__in=ids).delete()
        return Response({'detail': 'Selected comments have been successfully deleted.'},
                        status=status.HTTP_204_NO_CONTENT)

