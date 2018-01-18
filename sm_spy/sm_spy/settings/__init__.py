import os
from sm_spy.settings.base import *

if os.environ.get('ENV') == "development":
    from sm_spy.settings.development import *
