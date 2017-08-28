from rest_framework import serializers

from vk_app.models import PersonsGroups, WatchingGroups, PersonGroup


class CountSerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()

    def get_count(self, obj):
        return obj['count']


class GetOverviewUsersSerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()

    class Meta:
        model = PersonsGroups
        fields = ('dt_checking', 'count')

    def get_count(self, obj):
        return obj['count']


class PeopleOnlineSerializator(serializers.ModelSerializer):
    hour_online = serializers.SerializerMethodField()
    count_person = serializers.SerializerMethodField()

    class Meta:
        model = PersonGroup
        fields = ('hour_online', 'count_person')

    def get_hour_online(self, obj):
        return obj['hour_online']

    def get_count_person(self, obj):
        return obj['count_person']


class GetGroupsGeographySerializator(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()
    city_name = serializers.SerializerMethodField()

    class Meta:
        model = PersonGroup
        fields = ('city_id', 'count', 'city_name', )

    def get_count(self, obj):
        return obj['count']

    def get_city_name(self, obj):
        return obj['city__name']


class GetGroupsSerializator(serializers.ModelSerializer):
    class Meta:
        model = WatchingGroups
        fields = ('id', 'name', 'dt_last_update', 'link', )


class GetGroupsIntersectionSerializator(serializers.ModelSerializer):
    class Meta:
        model = PersonGroup
        fields = ('first_name', 'last_name', 'vk_id', )
