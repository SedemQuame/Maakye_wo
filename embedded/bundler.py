"""
Description: A python script, responsible for uploading extracted information from the "maakye_wo"
project to an external database or to an image/video storage system such as cloudinary.
Author: Sedem Quame Amekpewu
Date: Monday, 3rd February, 2020
"""

# modules
import json
import keys
import pymongo
import pprint
import uploader
import licensePlateExtractor as licensePlate
import os.path
from datetime import datetime

class app:
    def __init__(self, keys, asset_url):
        print("Application started")
        self.keys = keys
        self.video_local_url = asset_url

    def mongoDbConnection(self):
        try:
            client = pymongo.MongoClient(json.loads(keys.json_string)["MONGO_URL"])
            # Creating a database collection
            self.db = client.test
            print('MONGOCLIENT CONNECTION SUCCESSFUL.')

        except KeyError:
            # send a message to the user concerning connection failure.
            print('MONGOCLIENT CONNECTION UNSUCCESSFUL.')

    def storeVideoData(self, response):
        recordedVideos = self.db.videos
        # sample recordedVideos information that will be passed into the database.
        uploadedVideo = {
            'file_name': response["public_id"],
            'asset_url': response["url"],
            # 'duration': response["duration"],
            'format': response["format"],
            'date_created': str(datetime.date(datetime.now())),
            'time_created': str(datetime.time(datetime.now())),
            'camera_id': 'ABC342342342432'
        }
        result = recordedVideos.insert_one(uploadedVideo)
        if result.acknowledged:
            print("Successfully, stored vehicle data into database.")
            print("Video id: " + str(result.inserted_id))

            # getting license plate number
            plateNumbers =  licensePlate.Extractor(self.video_local_url).ocrExtractor()
            # storing video data.
            self.storeVehicleData(result.inserted_id, plateNumbers)
            # storing road data.
            self.storeRoadData()
        else:
            print("Failed, to store vehicle data into database.")

    def storeVehicleData(self, storedVideoId, plateNumbers):
        vehicles = self.db.vehicles
        # sample vehicle information that will be passed into the database.
        administrativeActions = {
            'charge': 'none',
            'flag_vehicle':'flagged',
            'license_suspension': 'unsuspended'
        }

        registeredDriverInfo = {
            'driver_name': 'unknown',
            'nationality': 'unknown',
            'driver_score': 'unknown',
            'number_of_violations': 'unknown'
        }

        vehicle = {
            'license': plateNumbers or "Unrecorded",        # This field, will pass the license number of the violator.
            'color': "Red",                                     # This field, will pass the recorded color.
            'speed': "60kmph",                                  # Recoreded speed of the car.
            'date_created': str(datetime.date(datetime.now())),
            'video_id': str(storedVideoId),
            'administrative_actions': administrativeActions,
            'registered_driver_info': registeredDriverInfo
        }

        result = vehicles.insert_one(vehicle)
        if result.acknowledged:
            print("Vehicle added to the database, successfully.")
            print("Data stored in row, with id: " + str(result.inserted_id))
        else:
            print("Failed to add vehicle information to the database.")

    def storeRoadData(self):
        roads = self.db.roads
        # sample roads information that will be passed into the database.
        road = {
            'street_name': 'Chelsea Street',            #Gets street name and other meta-date such as speeding range and road score from google maps
            'speed_range': '30kmp - 70kmph',
            'road_score': '4.5',
            'road_type': 'untade',                      
            'daily_temp': '30deg',                      #Gets temperature and other weather parameters, on that street
            'daily_humidity': '7.2',
            'avg_vehicle_count': '24',
            'number_of_accidents': '0',
            'camera_id': 'ABC342342342432',      #Special id, given to the camera.
        }
        result = roads.insert_one(road)
        if roads.acknowledged:
            print("Road information added to the database, successfully.")
            print("Road information, stored in row with id: " + str(result.inserted_id))
        else:
            print("Failed to add Road information to the database.")
    # creating a main function through which the entire program, will be run.

    def main(self):
        uploaderObj = uploader.assetUploader(self.keys, self.video_local_url)
        response = uploaderObj.fileUploader()
        pprint.pprint(response)
        self.mongoDbConnection()
        self.storeVideoData(response)
        # cleaning up object from thread pool.
        del uploaderObj
        del self 
