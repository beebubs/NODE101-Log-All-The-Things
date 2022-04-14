const express = require('express');
const fs = require('fs');
const morgan = require('morgan')
const path = require('path')
const logPath = path.join(__dirname, 'log.csv')
const csvWriter = require('csv-write-stream');
const CSVToJSON = require('csvtojson');
const app = express();
 
//create stream to log.csv
let logStream = fs.createWriteStream(logPath, {flags: 'a'});

morgan.token("no-comma-agent", function(req, res) {
    return req.headers['user-agent'].replace(',','');
})

//Create a new named format for logs
morgan.token("custom", ":no-comma-agent,:date[iso],:method,:url,HTTP/:http-version,:status");
//use the new format by name
app.use(morgan('custom'));

//create headers in log.csv
let writer = csvWriter({sendHeaders: false});
writer.pipe(fs.createWriteStream(logPath, {flags: 'a'}));
writer.write({
    header1: 'Agent',
    header2: 'Time',
    header3: 'Method',
    header4: 'Resource',
    header5: 'Version',
    header6: 'Status'
});
writer.end();
//write logs in log.csv
app.use(morgan('custom', {
    stream: logStream
}));


app.get('/', (req, res) => {
// write your code to respond "ok" here
    console.log(`${req.headers['user-agent'].replace(',','')},${new Date().toISOString()},${req.method},${req.url},HTTP/${req.httpVersion},${res.statusCode}`)
    res.status(200).send("ok");
});

app.set('json spaces', 2);
app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    CSVToJSON().fromFile(logPath)
    .then(users => {
        // users is a JSON array
        // log the JSON array
        res.json(users);
    }).catch(err => {
        // log error if any
        console.log(err);
    });

});

module.exports = app;
