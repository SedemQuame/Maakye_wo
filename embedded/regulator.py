"""
Description: A python script, responsible for uploading captured images/videos to the cloudinary storage platform,
and returns some meta data such as the url at which the asset is stored at.
Author: Sedem Quame Amekpewu
Date: Wednesday, 3rd June, 2020
"""

import datetime
import sqlite3
from sqlite3 import Error
from geopy.geocoders import Nominatim

class roadInfoUploadRegulator:
    def __init__(self):
        # self.now = datetime.datetime.now()
        # self.default_upload_time = now.replace(hour = 0, minute = 0, second = 0, microsecond = 0)
        try:
            # assigning connection method to variable.
            self.con = sqlite3.connect('road_meta_data.db')
            print('Connected to database successfully.')
        except Error:
            print('Error occurred when connecting to database.')

        self.dbId = "sjdfskdfsf"

    def createTable(self):
        # creating cursor
        cursorObj = self.con.cursor()
        # Creating table using python
        createSQLStatement = """CREATE TABLE IF NOT EXISTS road_meta_data (
                                id text PRIMARY KEY NOT NULL,
                                street_name text NOT NULL,
                                speed_range text NOT NULL,
                                road_score text NOT NULL,
                                road_type text NOT NULL,
                                daily_temp text NOT NULL,
                                daily_humility text NOT NULL,
                                avg_vehicle_count text NOT NULL,
                                number_of_accidents text NOT NULL,
                                camera_id text NOT NULL
                                )"""
        cursorObj.execute(createSQLStatement)
        self.con.commit()
        print("Meta table, created successfully.")

    # creating a function to insert data into the database.
    def insertIntoDB(self):
        # creating cursor
        cursorObj = self.con.cursor()

        # Getting geo-data from google specific to the embedded system.
        geolocator = Nominatim()
        location = geolocator.geocode("Madina, Ghana")
        print(location.address)
        print((location.latitude, location.longitude))

        street_name = location.address;
        speed_range = "";
        road_score = "0.00";
        road_type = "";
        daily_temp = "30 deg";
        daily_humidity = "68%";
        avg_vehicle_count = "0000";
        number_of_accidents = "0";
        camera_id = "";

        # Inserting data into database using python
        insertSQLStatement ="""INSERT INTO road_meta_data (
                                id, street_name, speed_range, road_score, 
                                road_type, daily_temp, daily_humility, avg_vehicle_count,
                                number_of_accidents, camera_id)
                                VALUES ('""" + self.dbId + """','""" + street_name + """', '""" + speed_range + """'
                                        , '""" + road_score + """', '""" + road_type + """'
                                        , '""" + daily_temp + """', '""" + daily_humidity + """'
                                        , '""" + avg_vehicle_count + """', '""" + number_of_accidents + """'
                                        , '""" + camera_id + """');
                            """
        cursorObj.execute(insertSQLStatement)
        self.con.commit()

    # creating a function for updating data in the database.
    def selectDataFromDB(self):
        # creating cursor
        cursorObj = self.con.cursor()
        # Selecting from the database using python
        selectSQLStatement ="""SELECT * FROM road_meta_data
                            """
        cursorObj.execute(selectSQLStatement)
        fields = cursorObj.fetchall()
        print(fields[0][1])
        return fields

    # creating a function to update data into the database.
    def updateCountRecordFromDB(self, count):
        # creating cursor
        cursorObj = self.con.cursor()
        # update vehicle count for that day.
        updateSQLStatement =""" UPDATE road_meta_data
                                SET avg_vehicle_count = """ + str(count) + """
                                WHERE
                                    id = " """  + self.dbId + """/";
                            """
        print(updateSQLStatement)
        cursorObj.execute(updateSQLStatement)
        self.con.commit()

# FOR TESTING PURPOSES ONLY ...
# dataRegulator = roadInfoUploadRegulator()
# dataRegulator.createTable()
# dataRegulator.insertIntoDB()
# dataRegulator.selectDataFromDB()