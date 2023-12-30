from rest_framework import serializers

from contact.models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    reply_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M", read_only=True)
    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M", read_only=True)

    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "title",
            "message",
            "file_path",
            "reply",
            "is_reply",
            "reply_at",
            "reply_by",
            "is_active",
            "is_deleted",
            "created_at",
        ]

    def validate(self, data):
        # Required fields for a POST request
        if self.context['request'].method == 'POST':
            required_fields = ['first_name', 'last_name', 'email', 'title', 'message']
            for field in required_fields:
                if field not in data or not data[field]:
                    raise serializers.ValidationError({field: f"This field is required for POST requests."})

        return data


class ContactMessageReplySerializer(serializers.Serializer):
    reply_message = serializers.CharField()
