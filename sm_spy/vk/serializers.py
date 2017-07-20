from rest_framework import serializers

from vk.models import PersonsGroups, WatchingGroups


class GetOverviewUsersSerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()

    class Meta:
        model = PersonsGroups
        fields = ('dt_checking', 'count')

    def get_count(self, obj):
        return obj['count']


class GetGroups(serializers.ModelSerializer):
    class Meta:
        model = WatchingGroups
        fields = ('id', 'name', 'dt_last_update', )
