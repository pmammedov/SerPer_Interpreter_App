from rest_framework import serializers

from languages.models import Languages


class LanguagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Languages
        fields = [
            "id",
            "name_tr",
            "name_en",
            "name_ar",
            "image",
            "order",
            "is_active",
            "is_deleted"
        ]
