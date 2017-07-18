import hashlib
import json
import random
import string

from django.shortcuts import render
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, models


def vk_auth(request):
    m = hashlib.md5()
    data = json.loads(request.body.decode('utf-8'))
    md_string = 'expire={expire}mid={mid}secret={secret}sid={sid}'.format(expire=data.get('expire'),
                                                                          mid=data.get('mid'),
                                                                          secret=data.get('secret'),
                                                                          sid=data.get('sid'),
                                                                          )
    m.update((md_string+'WxlYzySQzo2zSREclETI').encode())
    if m.hexdigest() == data.get('sig'):
        try:
            user = User.objects.get(username=data.get('id'))
        except ObjectDoesNotExist:
            user = User.objects.create_user(data.get('id'), None,
                                            '{}_strange_{}'.format(data.get('id'), ''.join(
                                                random.choice(string.ascii_uppercase + string.digits)
                                                for _ in range(10))))
            user.last_name = data.get('first_name')
            user.first_name = data.get('last_name')
            user.save()
        login(request, user)
    return render(request, 'base.html')