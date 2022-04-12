const express = require('express');
const fs = require('fs');
const morgan = require('morgan')
const path = require('path')
const logPath = path.join(__dirname, 'log.csv')
const csvWriter = require('csv-write-stream');
const app = express();
 
let logStream = fs.createWriteStream(logPath, {flags: 'a'});
// app.use(morgan('update', {
//     stream: "Agent,Time,Method,Resource,Version,Status"
// }));
//Create a new named format
morgan.token("custom", ":user-agent,:date[iso],:method,:url,HTTP/:http-version,:status");
//use the new format by name
app.use(morgan('custom'));

app.use(morgan('custom', {
    stream: logStream
}));
// fs.appendFile('log.csv', data, err => {
//         if (err) throw err 
//         console.log(err);
        
//     });






// app.use((req, res, next) => {
//     //write your logging code here
//     // fs.appendFile('log.csv', data, err => {
//     //     if (err) throw err 
//     //     console.log(err);
        
//     // });

// });


app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.status(200).send("ok");
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    // fs.readFile('./log.csv', 'utf8' , (err, data) => {
    //     if (err) {
    //     console.error(err)
    //     return
    //     }
    //     console.log(data)
    // });
    morgan.token("json", function(req, res) {
        return JSON.stringify({
            agent: req.useragent,
            time: req.date,
            method: req.method,
            resource: req.url,
            version: req.httpVersion,
            status: req.status
        })
    });


});

module.exports = app;
