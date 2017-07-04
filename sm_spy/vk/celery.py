import os
from ctypes import *
import logging

from django.conf import settings
from celery.app import shared_task


logger = logging.getLogger(__name__)


@shared_task()
def vk_checker():
    logger.info("vk_checker is stated")
    vk_checker = cdll.LoadLibrary(os.path.join(settings.BASE_DIR, 'bin', 'vk_group_checker.so'))
    vk_checker.StartChecker()