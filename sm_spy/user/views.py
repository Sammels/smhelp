from django.shortcuts import render
import hashlib
import json


def get_info(request):
    print('u', request.user)
    return render(request, 'base.html')

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
        print('auth')
    return render(request, 'base.html')