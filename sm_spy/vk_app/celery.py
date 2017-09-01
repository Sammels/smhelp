import os
import subprocess
import logging

from django.conf import settings
from celery.app import shared_task


logger = logging.getLogger(__name__)


@shared_task()
def vk_checker(group_id=None):
    logger.info("vk_checker is stated")
    command = ['{}'.format(os.path.join(settings.BASE_DIR, 'bin', 'vk_group_checker.so'))]
    if group_id:
        command += [str(group_id)]
    subprocess.Popen(command)
    logger.info("vk_checker is ended")


@shared_task()
def vk_online_checker(group_id=None):
    logger.info("vk_online_checker is stated")
    command = ['{}'.format(os.path.join(settings.BASE_DIR, 'bin', 'vk_online_checker.so'))]
    if group_id:
        command += [str(group_id)]
    subprocess.Popen(command)
    logger.info("vk_online_checker is ended")
