import os
import subprocess
import logging

from django.conf import settings
from celery.app import shared_task


logger = logging.getLogger(__name__)


@shared_task()
def proxy_parser():
    logger.info("proxy_parser is stated")
    subprocess.run(os.path.join(settings.BASE_DIR, 'bin', 'proxy_parser.so'))