from django.db import models


class Proxies(models.Model):
    QUALITY_BAD, QUALITY_GOOD = 0, 1
    CLASS_CHOICES = (
        (QUALITY_BAD, 'Good',),
        (QUALITY_GOOD, 'Bad',)
    )
    proxy_status = models.SmallIntegerField(choices=CLASS_CHOICES, default=0)
    ip = models.CharField(max_length=20)
    port = models.IntegerField()