import vk as vk_api
from django.core.management.base import BaseCommand

from vk_app.models import Country, City


class Command(BaseCommand):
    def handle(self, *args, **options):
        session = vk_api.Session()
        api = vk_api.API(session)
        Country(id=0, name='Не определен').save()
        City(country_id=0, id=0, name='Не определен').save()
        data = api.database.getCountries(count=1000)
        for d in data:
            country = Country(id=d['cid'], name=d['title'])
            country.save()
            data_cities = api.database.getCities(country_id=d['cid'], count=1000, need_all=1)
            trying = 1
            while len(data_cities) == 1000:
                for data_city in data_cities:
                    city = City(country_id=d['cid'], name=data_city['title'], id=data_city['cid'])
                    city.save()
                if len(data_cities) == 1000:
                    data_cities = api.database.getCities(country_id=d['cid'], count=1000, need_all=1,
                                                         offset=1000*trying)
                    trying += 1

            for data_city in data_cities:
                city = City(country_id=d['cid'], name=data_city['title'], id=data_city['cid'])
                city.save()
