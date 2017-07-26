import os
import subprocess
import logging

from django.conf import settings
from celery.app import shared_task


logger = logging.getLogger(__name__)


@shared_task()
def vk_checker():
    logger.info("vk_checker is stated")
    subprocess.run(os.path.join(settings.BASE_DIR, 'bin', 'vk_group_checker.so'))
