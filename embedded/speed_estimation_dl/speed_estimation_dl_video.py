# import the necessary packages
from pyimagesearch.centroidtracker import CentroidTracker
from pyimagesearch.trackableobject import TrackableObject
from pyimagesearch.utils import Conf
from imutils.video import VideoStream
from imutils.io import TempFile
from imutils.video import FPS
from datetime import datetime
from threading import Thread
import numpy as np
import argparse
import dropbox
import imutils
import dlib
import time
import cv2
import os
import keys
import json
import easygui

# USAGE
# NOTE: When using an input video file, speeds will be inaccurate
# because OpenCV can't throttle FPS according to the framerate of the
# video. This script is for development purposes only.
#
# python speed_estimation_dl.py --conf config/config.json --input sample_data/cars.mp4

class SpeedEstimator: 

    # class constructor
    def __init__(self, keys, videoSource):
        # inform the user about framerates and speeds
        print("[INFO] NOTE: When using an input video file, speeds will be " \
            "inaccurate because OpenCV can't throttle FPS according to the " \
            "framerate of the video. This script is for development purposes " \
            "only.")
        
        # passed values.
        self.keys = keys
        self.conf = json.loads(keys.json_string)

        # initialize the list of class labels MobileNet SSD was trained to detect
        self.CLASSES = ["background", "aeroplane", "bicycle", "bird", "boat",
                "bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
                "dog", "horse", "motorbike", "person", "pottedplant", "sheep",
                "sofa", "train", "tvmonitor"]

        # load our serialized model from disk
        print("[INFO] loading model...")
        self.net = cv2.dnn.readNetFromCaffe(self.conf["prototxt_path"], self.conf["model_path"])

        # initialize the video stream and allow the camera sensor to warmup
        print("[INFO] warming up camera...")
        self.vs = cv2.VideoCapture(videoSource)

        # passing the main executing thread for some period of time.
        time.sleep(1.0)

        # initialize the frame dimensions (we'll set them as soon as we read
        # the first frame from the video)
        self.H = None
        self.W = None

        # instantiate our centroid tracker, then initialize a list to store
        # each of our dlib correlation trackers, followed by a dictionary to
        # map each unique object ID to a TrackableObject
        self.ct = CentroidTracker(maxDisappeared=self.conf["max_disappear"], maxDistance=self.conf["max_distance"])

        self.trackers = []
        self.trackableObjects = {}

        # keep the count of total number of frames
        self.totalFrames = 0

        # initialize the log file
        self.logFile = None

        # initialize the list of various points used to calculate the avg of the vehicle speed
        self.points = [("A", "B"), ("B", "C"), ("C", "D")]

    
    # function responsible for starting the frames per second throughput estimator.
    def startFPS(self):
        self.fps = FPS().start()

    # function for creating a log file, if it does not exist.
    def createLogFileIfNotExist(self):
        # if the log file has not been created or opened
        if self.logFile is None:
            # build the log file path and create/open the log file
            self.logPath = os.path.join(self.conf["output_path"], self.conf["csv_name"])
            self.logFile = open(logPath, mode="a")

            # set the file pointer to end of the file
            pos = self.logFile.seek(0, os.SEEK_END)

            # if using an empty log file then
            # write the column headings
            if pos == 0:
                self.logFile.write("Year,Month,Day,Time,Speed (in MPH),ImageID\n")

    # function for determining the type of algorithm to use in detecting
    # vehicle speed.
    def runComputationallyTaskingAlgoIfBasicAlgoFails(self):
        # check to see if we should run a more computationally expensive
        # object detection method to aid our tracker
        if self.totalFrames % self.conf["track_object"] == 0:
            # initialize our new set of object trackers
            self.trackers = []

            # convert the frame to a blob and pass the blob through the
            # network and obtain the detections
            blob = cv2.dnn.blobFromImage(frame, size=(300, 300), ddepth=cv2.CV_8U)
            self.net.setInput(blob, scalefactor=1.0 / 127.5, mean=[127.5, 127.5, 127.5])
            detections = self.net.forward()

            # loop over the detections
            for i in np.arange(0, detections.shape[2]):
                # extract the confidence (i.e., probability) associated
                # with the prediction
                confidence = detections[0, 0, i, 2]

                # filter out weak detections by ensuring the `confidence`
                # is greater than the minimum confidence
                if confidence > self.conf["confidence"]:
                    # extract the index of the class label from the
                    # detections list
                    idx = int(detections[0, 0, i, 1])

                    # if the class label is not a car, ignore it
                    if self.CLASSES[idx] != "car":
                        continue

                    # compute the (x, y)-coordinates of the bounding box
                    # for the object
                    box = detections[0, 0, i, 3:7] * np.array([self.W, self.H, self.W, self.H])
                    (startX, startY, endX, endY) = box.astype("int")

                    # construct a dlib rectangle object from the bounding
                    # box coordinates and then start the dlib correlation
                    # tracker
                    tracker = dlib.correlation_tracker()
                    rect = dlib.rectangle(startX, startY, endX, endY)
                    tracker.start_track(self.rgb, rect)

                    # add the tracker to our list of trackers so we can
                    # utilize it during skip frames
                    self.trackers.append(tracker)
            
        # otherwise, we should utilize our object *trackers* rather than
        # object *detectors* to obtain a higher frame processing
        # throughput
        else:
            # loop over the trackers
            for tracker in self.trackers:
                # update the tracker and grab the updated position
                tracker.update(self.rgb)
                pos = tracker.get_position()

                # unpack the position object
                startX = int(pos.left())
                startY = int(pos.top())
                endX = int(pos.right())
                endY = int(pos.bottom())

                # add the bounding box coordinates to the rectangles list
                self.rects.append((startX, startY, endX, endY))

    # function for passing tempFile created, along with other
    # metadata.
    def upload_file(tempFile, client, imageID):
        # upload the image to Dropbox and cleanup the tempory image
        print("[INFO] uploading {}...".format(imageID))
        path = "/{}.jpg".format(imageID)
        client.files_upload(open(tempFile.path, "rb").read(), path)
        tempFile.cleanup()

    # program loop.
    def programLoop(self):
        while True:
            # grab the next frame from the stream, store the current
            # timestamp, and store the new date
            self.ret, self.frame = self.vs.read()
            self.ts = datetime.now()
            newDate = self.ts.strftime("%m-%d-%y")

            # check if the frame is None, if so, break out of the loop
            if (self.frame is None):
                # break
                return

            # if the log file has not been created or opened
            self.createLogFileIfNotExist()

            # resize the frame
            self.frame = imutils.resize(self.frame, width=self.conf["frame_width"])
            self.rgb = cv2.cvtColor(self.frame, cv2.COLOR_BGR2RGB)

            # if the frame dimensions are empty, set them
            if ((self.W is None) or (self.H is None)):
                (self.H, self.W) = self.frame.shape[:2]
                self.meterPerPixel = self.conf["distance"] / self.W

            # initialize our list of bounding box rectangles returned by
            # either (1) our object detector or (2) the correlation trackers
            rects = []

            runComputationallyTaskingAlgoIfBasicAlgoFails()

            objects = self.ct.update(self.rects)

            # loop over the tracked objects
            for (objectID, centroid) in objects.items():
                # check to see if a trackable object exists for the current
                # object ID
                to = self.trackableObjects.get(objectID, None)

                # if there is no existing trackable object, create one
                if to is None:
                    to = TrackableObject(objectID, centroid)

                # otherwise, if there is a trackable object and its speed has
                # not yet been estimated then estimate it
                elif not to.estimated:
                    # check if the direction of the object has been set, if
                    # not, calculate it, and set it
                    if to.direction is None:
                        y = [c[0] for c in to.centroids]
                        direction = centroid[0] - np.mean(y)
                        to.direction = direction

                    # if the direction is positive (indicating the object
                    # is moving from left to right)
                    if to.direction > 0:
                        # check to see if timestamp has been noted for
                        # point A
                        if to.timestamp["A"] == 0:
                            # if the centroid's x-coordinate is greater than
                            # the corresponding point then set the timestamp
                            # as current timestamp and set the position as the
                            # centroid's x-coordinate
                            if centroid[0] > self.conf["speed_estimation_zone"]["A"]:
                                to.timestamp["A"] = self.ts
                                to.position["A"] = centroid[0]

                        # check to see if timestamp has been noted for
                        # point B
                        elif to.timestamp["B"] == 0:
                            # if the centroid's x-coordinate is greater than
                            # the corresponding point then set the timestamp
                            # as current timestamp and set the position as the
                            # centroid's x-coordinate
                            if centroid[0] > self.conf["speed_estimation_zone"]["B"]:
                                to.timestamp["B"] = self.ts
                                to.position["B"] = centroid[0]

                        # check to see if timestamp has been noted for
                        # point C
                        elif to.timestamp["C"] == 0:
                            # if the centroid's x-coordinate is greater than
                            # the corresponding point then set the timestamp
                            # as current timestamp and set the position as the
                            # centroid's x-coordinate
                            if centroid[0] > self.conf["speed_estimation_zone"]["C"]:
                                to.timestamp["C"] = self.ts
                                to.position["C"] = centroid[0]

                        # check to see if timestamp has been noted for
                        # point D
                        elif to.timestamp["D"] == 0:
                            # if the centroid's x-coordinate is greater than
                            # the corresponding point then set the timestamp
                            # as current timestamp, set the position as the
                            # centroid's x-coordinate, and set the last point
                            # flag as True
                            if centroid[0] > self.conf["speed_estimation_zone"]["D"]:
                                to.timestamp["D"] = self.ts
                                to.position["D"] = centroid[0]
                                to.lastPoint = True

                    # if the direction is negative (indicating the object
                    # is moving from right to left)
                    elif to.direction < 0:
                        # check to see if timestamp has been noted for
                        # point D
                        if to.timestamp["D"] == 0:
                            # if the centroid's x-coordinate is lesser than
                            # the corresponding point then set the timestamp
                            # as current timestamp and set the position as the
                            # centroid's x-coordinate
                            if centroid[0] < self.conf["speed_estimation_zone"]["D"]:
                                to.timestamp["D"] = self.ts
                                to.position["D"] = centroid[0]

                        # check to see if timestamp has been noted for
                        # point C
                        elif to.timestamp["C"] == 0:
                            # if the centroid's x-coordinate is lesser than
                            # the corresponding point then set the timestamp
                            # as current timestamp and set the position as the
                            # centroid's x-coordinate
                            if centroid[0] < self.conf["speed_estimation_zone"]["C"]:
                                to.timestamp["C"] = self.ts
                                to.position["C"] = centroid[0]

                        # check to see if timestamp has been noted for
                        # point B
                        elif to.timestamp["B"] == 0:
                            # if the centroid's x-coordinate is lesser than
                            # the corresponding point then set the timestamp
                            # as current timestamp and set the position as the
                            # centroid's x-coordinate
                            if centroid[0] < self.conf["speed_estimation_zone"]["B"]:
                                to.timestamp["B"] = self.ts
                                to.position["B"] = centroid[0]

                        # check to see if timestamp has been noted for
                        # point A
                        elif to.timestamp["A"] == 0:
                            # if the centroid's x-coordinate is lesser than
                            # the corresponding point then set the timestamp
                            # as current timestamp, set the position as the
                            # centroid's x-coordinate, and set the last point
                            # flag as True
                            if centroid[0] < self.conf["speed_estimation_zone"]["A"]:
                                to.timestamp["A"] = self.ts
                                to.position["A"] = centroid[0]
                                to.lastPoint = True

                    # check to see if the vehicle is past the last point and
                    # the vehicle's speed has not yet been estimated, if yes,
                    # then calculate the vehicle speed and log it if it's
                    # over the limit
                    if to.lastPoint and not to.estimated:
                        # initialize the list of estimated speeds
                        estimatedSpeeds = []

                        # loop over all the pairs of points and estimate the
                        # vehicle speed
                        for (i, j) in self.points:
                            # calculate the distance in pixels
                            d = to.position[j] - to.position[i]
                            distanceInPixels = abs(d)

                            # check if the distance in pixels is zero, if so,
                            # skip this iteration
                            if distanceInPixels == 0:
                                continue

                            # calculate the time in hours
                            t = to.timestamp[j] - to.timestamp[i]
                            timeInSeconds = abs(t.total_seconds())
                            timeInHours = timeInSeconds / (60 * 60)

                            # calculate distance in kilometers and append the
                            # calculated speed to the list
                            distanceInMeters = distanceInPixels * self.meterPerPixel
                            distanceInKM = distanceInMeters / 1000
                            estimatedSpeeds.append(distanceInKM / timeInHours)

                        # calculate the average speed
                        to.calculate_speed(estimatedSpeeds)

                        # set the object as estimated
                        to.estimated = True
                        print("[INFO] Speed of the vehicle that just passed" \
                            " is: {:.2f} MPH".format(to.speedMPH))

                # store the trackable object in our dictionary
                self.trackableObjects[objectID] = to

                # draw both the ID of the object and the centroid of the
                # object on the output frame
                text = "ID {}".format(objectID)
                cv2.putText(self.frame, text, (centroid[0] - 10, centroid[1] - 10)
                            , cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                cv2.circle(self.frame, (centroid[0], centroid[1]), 4,
                        (0, 255, 0), -1)

                # check if the object has not been logged
                if not to.logged:
                    # check if the object's speed has been estimated and it
                    # is higher than the speed limit
                    if to.estimated and to.speedMPH > self.conf["speed_limit"]:
                        # set the current year, month, day, and time
                        year = self.ts.strftime("%Y")
                        month = self.ts.strftime("%m")
                        day = self.ts.strftime("%d")
                        time = self.ts.strftime("%H:%M:%S")

                        # check if dropbox is to be used to store the vehicle
                        # image
                        if self.conf["use_dropbox"]:
                            # initialize the image id, and the temporary file
                            imageID = self.ts.strftime("%H%M%S%f")
                            tempFile = TempFile()
                            cv2.imwrite(tempFile.path, self.frame)

                            # create a thread to upload the file to dropbox
                            # and start it
                            t = Thread(target=upload_file, args=(tempFile,
                                                                client, imageID,))
                            t.start()

                            # log the event in the log file
                            info = "{},{},{},{},{},{}\n".format(year, month,
                                                                day, time, to.speedMPH, imageID)
                            self.logFile.write(info)

                        # otherwise, we are not uploading vehicle images to
                        # dropbox
                        else:
                            # log the event in the log file
                            info = "{},{},{},{},{}\n".format(year, month,
                                                            day, time, to.speedMPH)
                            self.logFile.write(info)

                        # set the object has logged
                        to.logged = True
                
            # # if the *display* flag is set, then display the current frame
            # to the screen and record if a user presses a key
            if self.conf["display"]:
                cv2.imshow("frame", self.frame)
                key = cv2.waitKey(1) & 0xFF

                # if the `q` key is pressed, break from the loop
                if key == ord("q"):
                    break

            # increment the total number of frames processed thus far and
            # then update the FPS counter
            self.totalFrames += 1
            self.fps.update()

            # stop the timer and display FPS information
            self.fps.stop()
            print("[INFO] elapsed time: {:.2f}".format(self.fps.elapsed()))
            print("[INFO] approx. FPS: {:.2f}".format(self.fps.fps()))

    def closeLogFile(self):
        # check if the log file object exists, if it does, then close it
        if self.logFile is not None:
            self.logFile.close()

    # destroying all used resources.
    def destroyUsedResources(self):
        # close any open windows
        cv2.destroyAllWindows()
        # clean up
        print("[INFO] cleaning up...")
        self.vs.release()

    def main(self):
        # starting FPS.
        self.startFPS()

        # running program, loop.
        self.programLoop()

        # closing the log file
        self.closeLogFile()

        # destroying all used resources
        destroyUsedResources()


# creating speed estimator object.
estimator = SpeedEstimator()

# calling the main function
estimator.main()