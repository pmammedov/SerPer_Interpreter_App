from rest_framework import serializers

from sitesettings.models import SiteSettingsModel


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettingsModel
        fields = [
            "id",
            "title",
            "about_us_tr",
            "about_us_en",
            "about_us_ar",

            "phone",
            "email",
            "address",

            "facebook",
            "instagram",
            "twitter",
            "linkedin",
            "google",
            "youtube",

            "is_active",
            "is_deleted",
        ]
