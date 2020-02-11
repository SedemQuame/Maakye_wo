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

cloudinary.config( 
        cloud_name = json.loads(keys.json_string)["CLOUDINARY_NAME"], 
        api_key = json.loads(keys.json_string)["CLOUDINARY_KEY"], 
        api_secret = json.loads(keys.json_string)["CLOUDINARY_SECRET"]
        )


response = cloudinary.uploader.upload("license_plates\images (3).jfif", ocr = "adv_ocr")

print(response)