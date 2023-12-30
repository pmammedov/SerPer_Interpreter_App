from rest_framework import serializers

from news.models import NewsModel


class NewsSerializer(serializers.ModelSerializer):

    class Meta:
        model = NewsModel
        fields = [
            "id",
            "title_tr",
            "title_en",
            "title_ar",
            "content_tr",
            "content_en",
            "content_ar",
            "image",
            "is_active",
            "is_deleted"
        ]
