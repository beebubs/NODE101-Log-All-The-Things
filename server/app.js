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

//alter user-agent token to get rid of comma
//this step was taken so that when I return my json obj to /logs it does not split my headers at the wrong comma
morgan.token("no-comma-agent", function(req, res) {
    return req.headers['user-agent'].replace(',','');
})

//Create a new custom format for logs
morgan.token("custom", ":no-comma-agent,:date[iso],:method,:url,HTTP/:http-version,:status");

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
//use the new custom format by name to write logs in log.csv
app.use(morgan('custom', {
    stream: logStream
}));


app.get('/', (req, res) => {
// write your code to respond "ok" here
//this console.log is for passing the tests
    console.log(`${req.headers['user-agent'].replace(',','')},${new Date().toISOString()},${req.method},${req.url},HTTP/${req.httpVersion},${res.statusCode}`)
    res.status(200).send("ok");
});

//this spaces my json obj so I can read it more easily
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
