from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response

from sitesettings.models import SiteSettingsModel
from sitesettings.serializers import SiteSettingsSerializer
from utils.permissions import IsAdminOrReadOnly


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettingsModel.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [IsAdminOrReadOnly]
    ordering = ['-pk']

    def get_queryset(self):
        order_by = self.request.query_params.get('order_by', '-id')
        return SiteSettingsModel.objects.filter(is_deleted=False).order_by(order_by)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            headers = self.get_success_headers(serializer.data)
            return Response(
                {"status": True,
                 "message": "Page settings have been successfully created.",
                 "data": serializer.data},
                status=status.HTTP_201_CREATED, headers=headers)
        return Response(
            {"status": False,
             "message": "Page settings could not be created.",
             "data": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save(updated_by=request.user, updated_at=timezone.now())
            return Response(
                {"status": True,
                 "message": "Page settings have been successfully updated.",
                 "data": serializer.data},
                status=status.HTTP_200_OK)
        return Response(
            {"status": False,
             "message": "Page settings could not be updated.",
             "data": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = timezone.now()
        instance.is_deleted = True
        instance.deleted_by = request.user
        instance.save()
        return Response(
            {"status": True, "message": "Page settings have been successfully deleted.", "data": []},
            status=status.HTTP_200_OK)
