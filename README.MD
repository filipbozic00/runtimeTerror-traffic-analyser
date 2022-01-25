# Project - Road Scanner

Project which receives data from an Android mobile application and after processing displays that data in a meaningful way on a React application.



## Mobile application

The mobile application is made for android devices.
The app gathers location data and takes photos, then sends this data to the API. The data gets gathered and sent within a set time interval.



## API

The API is based on Express.js and handles communication between the mobile application, database and website.
Upon recieving data from the mobile application, the API sends that data through python scripts for processing. 
Once the data is processed the API then stores it in the database.



## Website

The website is based on React.js and it is used to showcase the processed data stored in the database.