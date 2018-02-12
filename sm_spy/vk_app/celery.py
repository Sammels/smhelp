import os
import time
import subprocess
import logging
import json
import redis

from django.http import HttpResponseBadRequest
from django.conf import settings
from celery.app import shared_task

import vk as vk_api

logger = logging.getLogger(__name__)


@shared_task()
def vk_checker(group_id=None):
    logger.info("vk_checker is stated")
    command = ['{}'.format(os.path.join(settings.BASE_DIR, 'bin', 'vk_group_checker.so'))]
    if group_id:
        command += [str(group_id)]
    subprocess.Popen(command)
    # TODO: добавить сбор информации по одной группе
    command = ['{}'.format(os.path.join(settings.BASE_DIR, 'bin', 'vk_post_collector.so'))]
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


@shared_task()
def vk_action_checker(group_id=None):
    logger.info("vk_action_checker is stated")
    command = ['{}'.format(os.path.join(settings.BASE_DIR, 'bin', 'vk_actions.so'))]
    if group_id:
        command += [str(group_id)]
    subprocess.Popen(command)
    logger.info("vk_actions is ended")


@shared_task()
def vk_people_collect(query: str, label: str):
    from vk_app.models import Store
    r = redis.StrictRedis(host='localhost', port=6379, db=0)
    r_key = 'last_query{}'.format(settings.VK_API_USER_KEY)
    time_out = 0.5
    groups = []
    session = vk_api.Session(settings.VK_API_USER_KEY)
    api = vk_api.API(session)
    try:
        vk_data = api.search.getHints(q=query, limit=200, filters="groups,publics", search_global=1, v=5.71)
    except vk_api.exceptions.VkAPIError as e:
        return HttpResponseBadRequest(e)
    for d in vk_data["items"]:
        if d["type"] in ("group") and d["group"]["is_closed"] == 0:
            groups.append(d)
    glob_members = []
    logger.info("Count: {}, label: {}".format(len(groups), label))
    try:
        for key, group_item in enumerate(groups):
            members = []
            last_query = r.get(r_key)
            if last_query is None:
                last_query = 0
            last_query_dif = time.time() - float(last_query)
            if last_query_dif < time_out:
                time.sleep(time_out - last_query_dif)
            members_answer = api.groups.getMembers(group_id=group_item["group"]["id"])
            r.set(r_key, time.time())
            members += members_answer["users"]
            while len(members) < members_answer["count"]:
                last_query = r.get(r_key)
                last_query_dif = time.time() - float(last_query)
                if last_query_dif < time_out:
                    time.sleep(time_out - last_query_dif)
                members_answer = api.groups.getMembers(group_id=group_item["group"]["id"], offset=len(members))
                r.set(r_key, time.time())
                members += members_answer["users"]
            logger.info("Group of: {}, label: {}".format(key + 1, label))
            glob_members += members
        content = json.dumps(list(set(glob_members)))
    except Exception as e:
        print(e)
        content = json.dumps({"error": str(e)})
    store = Store(key=label, value=content, is_file=True)
    store.save()
