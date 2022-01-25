from contextlib import nullcontext
import cv2
import numpy as np
import pytesseract as tess
import imutils
import argparse
import sys
import requests

tess.pytesseract.tesseract_cmd = 'C:/Program Files/Tesseract-OCR/tesseract.exe'


#parse the arguments
ap = argparse.ArgumentParser()
# path to image
ap.add_argument("-i", "--image", required=True, help="path to image")
args = vars(ap.parse_args())

resp = requests.get(args["image"], stream=True).raw
image = np.asarray(bytearray(resp.read()), dtype="uint8")
image = cv2.imdecode(image, cv2.IMREAD_COLOR)

#resize the image to 500
image = imutils.resize(image, width=500)

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#cv2.imshow("Grayscale image", gray)
#cv2.waitKey(0)

#reduce noise from the image, make it smooth
gray = cv2.bilateralFilter(gray, 11, 17, 17)

#find the edges in the image
edged = cv2.Canny(gray, 170, 200)
#cv2.imshow("Canny edge", edged)
#cv2.waitKey(0)

#find the contours based on the images
contours, new = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
#new is hierarchy - relationship
#RETR_LIST - retrieves all the contours but doesn't create any parent-child relationship
#CHAIN_APPROX_SIMPLE - removes all the redundant contours and compress the contour by saving memory

# create a copy of the original image to draw all the contours
image1 = image.copy()
cv2.drawContours(image1, contours, -1, (0,255,0), 3)
#cv2.imshow("Canny after contouring", image1)
#cv2.waitKey(0)

#sort the contours based on their areas and select top 30 areas, then reverse their order(from max to mix)
contours = sorted(contours, key=cv2.contourArea, reverse=True)[:30]
NumberPlateCount = None

#because currently we don't have any contour or we can say it will show how many number plates are there in the image

#to draw the top 30 contours we will make a copy of our original image
image2 = image.copy()
cv2.drawContours(image2, contours, -1, (0,255,0), 3)
#cv2.imshow("Top 30 contours", image2)
#cv2.waitKey(0)

#find the best possible contour of our expected number plate
count = 0
name = 1
crop_image = np.zeros

for i in contours:
    perimeter = cv2.arcLength(i, True)    #calculate perimeter
    approx = cv2.approxPolyDP(i, 0.02*perimeter, True) #approximates the curve of polygon with specified precision
    if(len(approx) == 4):  #4 means it has 4 corners, which will be probably our number plate
        NumberPlateCount = approx
        #crop that rectangle part
        x, y, w, h = cv2.boundingRect(i)
        crop_image = image[y:y+h, x:x+w]
        name += 1
        break
    
#draw a contour in the detect license plate image
if([NumberPlateCount] != None):
    cv2.drawContours(image, [NumberPlateCount], -1, (0,255,0), 3)
    #cv2.imshow("Final image", image)
    #cv2.waitKey(0)

    #cv2.imshow("Cropped image", crop_image)
    #cv2.waitKey(0)

    text = tess.image_to_string(crop_image, lang='eng', config='-c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ --psm 8 --oem 3')
    print(text)
    sys.stdout.write(str(text))
    sys.stdout.flush()
    sys.exit(0)

else:
    print("No license plate detected")
    