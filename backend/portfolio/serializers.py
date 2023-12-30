from rest_framework import serializers

from portfolio.models import PortfolioModel


class PortfolioSerializer(serializers.ModelSerializer):

    class Meta:
        model = PortfolioModel
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
