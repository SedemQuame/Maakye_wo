"""
Description: A python script, responsible for uploading captured images/videos to the cloudinary storage platform,
and returns some meta data such as the url at which the asset is stored at.
Author: Sedem Quame Amekpewu
Date: Monday, 3rd February, 2020
"""

# modules
import json
import keys
import cloudinary
import cloudinary.uploader
import cloudinary.api
import uuid
import pprint

class assetUploader:
    def __init__(self, keys, asset_url):
        self.keys = keys
        self.asset_url = asset_url
        print("INNIT FUNCTION")
    
    def generateUUID(self):
        uui = uuid.uuid4()
        return("video_" + str(uui.hex))
        print("GENERATING UUID")

    def fileUploader(self):    
        print("IN FILE UPLOADER")
        uuid = self.generateUUID()
        cloudinary.config( 
        cloud_name = json.loads(self.keys.json_string)["CLOUDINARY_NAME"], 
        api_key = json.loads(self.keys.json_string)["CLOUDINARY_KEY"], 
        api_secret = json.loads(self.keys.json_string)["CLOUDINARY_SECRET"]
        )

        print("GETTING A RESPONSE")

        response =  cloudinary.uploader.upload_large(self.asset_url, 
                    resource_type = "image",
                    public_id = "maakye_wo/" + uuid,
                    chunk_size = 6000000,
                    eager = [
                        { "width": 300, "height": 300, "crop": "pad", "audio_codec": "none"},
                        { "width": 160, "height": 100, "crop": "crop", "gravity": "south",
                            "audio_codec": "none"}],
                    )
        print("File uploaded successfully.")
        return(response)


# uploadscript = assetUploader(keys, "sample_data/cars1.mp4")
# uploadscript.fileUploader()


# Exceptions to handle.
# 1. NewConnectionError
# 2. MaxRetryError
# 3. cloudinary.exceptions.Error
# 4. FileNotFoundError

