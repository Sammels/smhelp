from rest_framework import serializers

from vk.models import PersonsGroups


class GetOverviewUsersSerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()

    class Meta:
        model = PersonsGroups
        fields = ('dt_checking', 'count')

    def get_count(self, obj):
        return obj['count']
