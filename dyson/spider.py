import urllib.request
import socket
from urllib import error
try:
    response = urllib.request.urlopen(u'https://wiki.biligame.com/dsp/%E5%85%89%E6%A0%85%E7%9F%B3')
    print(response.status)
    print(response.read().decode('utf-8'))
except error.HTTPError as e:
    print(e.reason,e.code,e.headers,sep='\\n')
except error.URLError as e:
    print(e.reason)
else:
    pass
print('Request Successfully')