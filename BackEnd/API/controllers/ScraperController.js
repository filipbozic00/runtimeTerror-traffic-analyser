const path = require('path');
const url = require('../public/javascripts/sloveniaCams.json');
const {Worker} = require("worker_threads");
const paralelScrape = path.resolve(__dirname, '../public/javascripts/paralelScrape.js');

module.exports = {
    scrapeAll: function () {
        var divider = 2;
        var subArrayLength = Math.floor(url.length / divider);
        var remaining = url.length % divider;

        var start = 0;
        var end = subArrayLength;
        for (let workerNumber = 0; workerNumber < divider; workerNumber++) {
            if (workerNumber == divider - 1) {
                end += remaining;
            }
            const worker = new Worker(paralelScrape, {workerData: {startIndex: start, endIndex: end, urls: url}})

            worker.once("message", result => {
                console.log(`Thread number ${result} has finished.`);
            });
            
            worker.on("error", error => {
                console.log(error);
            });
            
            worker.on("exit", exitCode => {
                console.log(`It exited with code ${exitCode}`);
            });

            start += subArrayLength;
            end += subArrayLength;
        }

        console.log(`It works!`);
    }
}