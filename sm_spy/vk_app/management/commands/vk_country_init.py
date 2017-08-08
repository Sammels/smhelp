import vk as vk_api
from django.core.management.base import BaseCommand

from vk_app.models import Country, City


class Command(BaseCommand):
    def handle(self, *args, **options):
        session = vk_api.Session()
        api = vk_api.API(session)
        Country.objects.get_or_create(id=0, name='Не определен')
        data = api.database.getCountries(count=1000, need_all=1)
        trying = 1
        while len(data) == 1000:
            for d in data:
                counry, create  = Country.objects.get_or_create(id=d['cid'], name=d['title'])
                data_cities = api.database.getCities(country_id=counry.pk, count=1000, need_all=1)
                ctrying = 1
                while len(data_cities) == 1000:
                    for data_city in data_cities:
                        City.objects.get_or_create(country_id=counry.pk, name=data_city['title'], id=data_city['cid'])
                    if len(data_cities) == 1000:
                        try:
                            data_cities = api.database.getCities(country_id=d['cid'], count=1000, need_all=1,
                                                             offset=1000 * ctrying)
                        except Exception:
                            continue
                        ctrying += 1

                for data_city in data_cities:
                    City.objects.get_or_create(country_id=counry.pk, name=data_city['title'], id=data_city['cid'])
            if len(data) == 1000:
                data = api.database.getCountries(count=1000, need_all=1, offset=1000*trying)
                trying += 1
        for d in data:
            counry, create = Country.objects.get_or_create(id=d['cid'], name=d['title'])
            data_cities = api.database.getCities(country_id=counry.pk, count=1000, need_all=1)
            ctrying = 1
            while len(data_cities) == 1000:
                for data_city in data_cities:
                    City.objects.get_or_create(country_id=counry.pk, name=data_city['title'], id=data_city['cid'])
                if len(data_cities) == 1000:
                    try:
                        data_cities = api.database.getCities(country_id=d['cid'], count=1000, need_all=1,
                                                         offset=1000 * ctrying)
                    except Exception:
                        continue
                    ctrying += 1

            for data_city in data_cities:
                City.objects.get_or_create(country_id=counry.pk, name=data_city['title'], id=data_city['cid'])
