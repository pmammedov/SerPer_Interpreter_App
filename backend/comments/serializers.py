from rest_framework import serializers

from comments.models import Comments


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "comment",
            "is_active",
            "is_deleted"
        ]

    def validate(self, data):
        # Required fields for a POST request
        if self.context['request'].method == 'POST':
            required_fields = ['first_name', 'last_name', 'email', 'comment']
            for field in required_fields:
                if field not in data or not data[field]:
                    raise serializers.ValidationError({field: f"This field is required for POST requests."})

        return data
