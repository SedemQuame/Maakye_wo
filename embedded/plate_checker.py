import requests
from pprint import pprint
regions = ['gb', 'ng'] # Change to your country
with open('94d58dc7-a021-40a4-a49f-4b3b20b6ab85.jpg', 'rb') as fp:
    response = requests.post(
        'https://api.platerecognizer.com/v1/plate-reader/',
        data=dict(regions=regions),  # Optional
        files=dict(upload=fp),
        headers={'Authorization': 'Token 4ce5feee7181ddb1eb7de4db7638c487bb2fcf95'})
pprint(str(response.json()))