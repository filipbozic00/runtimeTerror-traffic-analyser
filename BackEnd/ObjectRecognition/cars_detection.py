import cv2
import numpy as np
import argparse
import cvlib as cv
import sys
import requests
from matplotlib import pyplot as plt
from cvlib.object_detection import draw_bbox


#parse the arguments
ap = argparse.ArgumentParser()
# path to image
ap.add_argument("-i", "--image", required=True, help="path to image")
args = vars(ap.parse_args())
resp = requests.get(args["image"], stream=True).raw
image = np.asarray(bytearray(resp.read()), dtype="uint8")
image = cv2.imdecode(image, cv2.IMREAD_COLOR)
#image = cv2.imread(args["image"])

bbox, label, conf = cv.detect_common_objects(image)
#output_image = draw_bbox(image, bbox, label, conf)
#plt.imshow(output_image)
#plt.show()

#print(str(label.count('car')))

sys.stdout.write(str(label.count('car')))
sys.stdout.flush()
sys.exit(0)



#car_haarcascade = cv2.CascadeClassifier('haar/haarcascade_car.xml')

# detect_car = car_haarcascade.detectMultiScale(image, 1.1, 9)
# dim=(850,550)
# for(x,y,w,h) in detect_car:
#     plate = image[y : y+h, x:x + w]
#     cv2.rectangle(image, (x,y), (x+w, y+x), (51,51,255), 2)
#     cv2.rectangle(image, (x, y - 40), (x + w, y), (51,51,255), -2)
#     cv2.putText(image, 'Car', (x ,y - 10), cv2.FONT_HERSHEY_SIMPLEX,  0.5, (0,0,255), 2)
#     resized = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)
#     cv2.imshow("Image", resized)

# cv2.waitKey(0)
# cv2.destroyAllWindows()

