from django.contrib.auth import models
from rest_framework import generics
from rest_framework.response import Response

from user.serializers import UserSerializer


class GetInfo(generics.GenericAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        try:
            return models.User.objects.get(pk=self.request.user.pk)
        except Exception:
            return self.queryset

    def get(self, request, *args, **kwargs):
        instance = self.get_queryset()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
