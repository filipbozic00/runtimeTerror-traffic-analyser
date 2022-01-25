import matplotlib
from numpy.core.fromnumeric import var
from scipy.ndimage.measurements import label
from tensorflow.keras.preprocessing import image
matplotlib.use("Agg") # use the "Agg" backend to be able to export our plots as image files to disk

#import necessary packages
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical
from sklearn.metrics import classification_report
from skimage import transform
from skimage import exposure
from skimage import io

from trafficsignnet import TrafficSignNet
import matplotlib.pyplot as plt
import numpy as np
import argparse
import random
import os

def load_split(basePath, csvPath):
    #initialize the list of data and models
    data = []
    labels = []
 
	# load the contents of the CSV file, remove the first line (because
	# it contains the CSV header), and shuffle the rows (otherwise
	# all examples of a particular class will be in sequential order)
    rows = open(csvPath).read().strip().split("\n")[1:] 
    random.shuffle(rows)

    #loop over the rows of CSV file
    for (i, row) in enumerate (rows):
        # check to see if we should show a status update
        if i > 0 and i % 1000 == 0:
            print("[INFO] processed {} total images".format(i))
        
        #split the row into components and take the class ID and image path
        (label, imagePath) = row.strip().split(",")[-2:]

        #derive the full path to the image and load it
        imagePath = os.path.sep.join([basePath, imagePath])
        image = io.imread(imagePath)

        #resize the image to 32x32 pixels, ignore aspect ratio, and the perform
        #Contrast Limited Adaptive Histogram Equalization(CLAHE)
        image = transform.resize(image, (32,32))
        image = exposure.equalize_adapthist(image, clip_limit=0.1)

        #update the list of data and models
        data.append(image) 
        labels.append(int(label)) 

    #convert the data and labels to numpy arrays
    data = np.array(data)
    labels = np.array(labels)

    #return a tuple of the data and labels
    return (data, labels)


#parsing the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-d", "--dataset", required=True, help="Path to input GTRSB")
ap.add_argument("-m", "--model", required=True, help="Path to output model")
ap.add_argument("-p", "--plot", type=str, default="plot.png", help="path to training history plot")
args = vars(ap.parse_args())

# initialize the number of epochs to train for, base learning rate and batch size
NUM_EPOCHS = 30 #how many iterations it will go through
INIT_LR = 1e-3
BS = 64


# load the label names
labelNames = open("signnames.csv").read().strip().split("\n")[1:]
labelNames = [l.split(",")[1] for l in labelNames]

#path to the training and testing CSV files
trainPath = os.path.sep.join([args["dataset"], "Train.csv"])
testPath = os.path.sep.join([args["dataset"], "Test.csv"])

#load the training and testing data
print("[INFO] loading training and testing data...")
(trainX, trainY) = load_split(args["dataset"], trainPath)
(testX, testY) = load_split(args["dataset"], testPath)

#scale data to the range of [0,1]
trainX = trainX.astype("float32") / 255.0
testX = testX.astype("float32") / 255.0

# one-hot encode the training and testing labels
numLabels = len(np.unique(trainY))
trainY = to_categorical(trainY, numLabels)
testY = to_categorical(testY, numLabels)

# calculate the total number of images in each class and
# initialize a dictionary to store the class weights
classTotals = trainY.sum(axis=0)
classWeight = dict()

#loop over all classess and calculate the class weight
for i in range(0, len(classTotals)):
    classWeight[i] = classTotals.max() / classTotals[i]

#construct the image generator for data augmentation
aug = ImageDataGenerator(
    rotation_range=10,
    zoom_range = 0.15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.15,
    horizontal_flip=False,
    vertical_flip=False,
    fill_mode="nearest"
)

#initialize the optimizer and compile the model
print("[INFO] compiling model...")
opt = Adam(lr=INIT_LR, decay=INIT_LR / (NUM_EPOCHS * 0.5))
model = TrafficSignNet.build(width=32, height=32, depth=3, classes=numLabels)
model.compile(loss="categorical_crossentropy", optimizer=opt, metrics=["accuracy"])

#train the network
print("[INFO] training network...")
H = model.fit(
    aug.flow(trainX, trainY, batch_size=BS),
    validation_data=(testX, testY),
    steps_per_epoch=trainX.shape[0] // BS,
    epochs=NUM_EPOCHS,
    class_weight=classWeight,
    verbose=1
)

# evaluate the network
print("[INFO] evaluating network...")
predictions = model.predict(testX, batch_size=BS)
print(classification_report(testY.argmax(axis=1),
predictions.argmax(axis=1), target_names=labelNames))

#save the network to disk
print("[INFO] serializing network to '{}'...".format(args["model"]))
model.save(args["model"])

# # plot the training loss and accuracy
# N = np.arange(0, NUM_EPOCHS)
# plt.style.use("ggplot")
# plt.figure()
# plt.plot(N, H.history["loss"], label="train_loss")
# plt.plot(N, H.history["val_loss"], label="val_loss")
# plt.plot(N, H.history["accuracy"], label="train_acc")
# plt.plot(N, H.history["val_accuracy"], label="val_acc")
# plt.title("Training Loss and Accuracy on Dataset")
# plt.xlabel("Epoch #")
# plt.ylabel("Loss/Accuracy")
# plt.legend(loc="lower left")
# plt.savefig(args["plot"])
