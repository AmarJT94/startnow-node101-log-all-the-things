const express = require('express');
const fs = require('fs');
const app = express();
const path = require("path");
var thePath = path.join(__dirname, "log.csv");

app.use((req, res, next) => {
// Object containing all values from user at use.   
    var logVomit = {};
    logVomit.header = req.headers['user-agent'].replace(",", "");
    logVomit.time = new Date().toISOString();
    logVomit.method = req.method;
    logVomit.path = req.path;
    logVomit.version = "HTTP/" + req.httpVersion;
    logVomit.status = res.statusCode;
    next();
// Appends log values to CSV file.
    fs.appendFile('server/log.csv', "\n" + logVomit.header + "," + logVomit.time + "," + logVomit.method + "," + logVomit.path + "," + logVomit.version + "," + logVomit.status, (err) => {
    if (err) throw err;
    });
    var currentLog = logVomit.header + "," + logVomit.time + "," + logVomit.method + "," + logVomit.path + "," + logVomit.version + "," + logVomit.status;
    console.log(currentLog);
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.sendStatus(200).json("ok");
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    var jsonLogs = [];
// Object data being transferred from log to JSON object.
    fs.readFile(thePath, "utf8", (err, data) => {
    var firstSplit = data.split("\n");
    firstSplit.shift();
    for (var i = 0; i < firstSplit.length; i++) {
        var vomitBucket = {};
        var secondSplit = firstSplit[i].split(",");
        vomitBucket.Agent = secondSplit[0];
        vomitBucket.Time = secondSplit[1];
        vomitBucket.Method = secondSplit[2];
        vomitBucket.Version = secondSplit[4];
        vomitBucket.Status = secondSplit[5];
        jsonLogs.push(vomitBucket);
    };
    if (err) throw err;
        jsonLogs.shift();
        res.status(200).json(jsonLogs);
    });
});

module.exports = app;
