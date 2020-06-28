"""
Description: A python script, responsible for detecting and extracting number plates, in images.
Author: Sedem Quame Amekpewu
Date: Monday, 11th February, 2020
"""

# modules
import json
import keys
import requests
from pprint import pprint


class Extractor: 
        def __init__(self, imageSrc):
                self.imageSrc = imageSrc
                self.regions = ['gb', 'ng'] # Change to your country
                self.response = ""


        def ocrExtractor(self):
                with open(self.imageSrc, 'rb') as fp:
                        self.response = requests.post(
                                'https://api.platerecognizer.com/v1/plate-reader/',
                                data=dict(regions=self.regions),  # Optional
                                files=dict(upload=fp),
                                headers={'Authorization': 'Token 4ce5feee7181ddb1eb7de4db7638c487bb2fcf95'})
                return json.dumps(self.response.json());