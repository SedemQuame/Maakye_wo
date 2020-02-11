"""
Description: A python script, responsible for detecting and extracting number plates, in images.
Author: Sedem Quame Amekpewu
Date: Monday, 11th February, 2020
"""

# modules
import json
import keys
import cloudinary
import cloudinary.uploader
import cloudinary.api
import pprint


class Extractor: 
        def __init__(self, imageSrc):
                self.imageSrc = imageSrc


        def ocrExtractor(self):
                cloudinary.config( 
                cloud_name = json.loads(keys.json_string)["CLOUDINARY_NAME"], 
                api_key = json.loads(keys.json_string)["CLOUDINARY_KEY"], 
                api_secret = json.loads(keys.json_string)["CLOUDINARY_SECRET"]
                )
                response = cloudinary.uploader.upload(self.imageSrc, ocr = "adv_ocr")
                # print(response)
                return response
        
# creating object, using plat extractor class.

numberPlate = Extractor("license_plates\images (2).jfif")
obj = numberPlate.ocrExtractor()

# Getting the license plate, numbers.
licensePlateText = obj["info"]["ocr"]["adv_ocr"]["data"][0]["textAnnotations"][0]["description"]
print(licensePlateText)