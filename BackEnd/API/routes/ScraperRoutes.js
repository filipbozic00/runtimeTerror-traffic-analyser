const express = require('express');
const router = express.Router();
var ScraperController = require('../controllers/ScraperController.js');
const cheerio = require("cheerio");
const axios = require('axios');
const fs = require('fs');
const fetch = require('node-fetch');
require('isomorphic-fetch');
const url = require('../public/javascripts/sloveniaCams.json');

async function scrapeAll(){
    for (link in url) {
        const response = await fetch(url[link]);
        const html = await response.text();
        const $ = await cheerio.load(html);

        // Extracts the traffic camera image
        const img = $('#webcam-live > img').attr('src');

        // Extracts the location of the camera
        const location = $('li:contains("Lat/Long:")').text();

        // Extract the latitude and longditude from the location string
        let geolocation = location.match(/\d+(\.\d+)?/gi)
        let latitude = geolocation[0];
        let longditude = geolocation[1];
        let locData = [];
        console.log('lat and long: ' + latitude + ' ' + longditude);

        // Send location data as json
        axios.post('http://localhost:3001/gps', {
            'latitude': latitude,
            'longditude': longditude,
            'altitude': 0,
            'speed': 0,
            'accuracy': 0
        })
        .then(res => {
            console.log(res.data)
            locData = res.data;
        })
        .catch(error => {
            console.error(error)
        });

        // Path where the image will be stored locally
        let savepath = 'images/' + Date.now() + '.jpg';

        // Fetch image file from url and save it to local directory
        const fetchResponse = await fetch(img);
        const buffer = await fetchResponse.buffer();
        fs.writeFile('public/'+savepath, buffer, () => {
            console.log('finished downloading! ' + 'public/'+savepath);
        })

        // Send the image path to mongoDB
        axios.post('http://localhost:3001/camera/cam', {
            'filepath': savepath,
            'location_id': locData._id,
            'link': url[link]
        }).then(res => {
            console.log("Sent camera path")
        })
        .catch(error => {
            console.error(error)
        });

        //await new Promise(resolve => setTimeout(resolve, 4000)); eat a dick zephy
    }
    return 'Pages were scraped';
}

// router.get('/', function(req, res, next) {
//     scrapeAll();
//     res.render('index', { title: 'Express' });
// });

router.get('/', ScraperController.scrapeAll);

module.exports = router;
