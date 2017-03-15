var path = require('path');
var express = require('express');
var app = express();

app.use('/third_party', express.static(__dirname + '/third_party'));
app.use('/data', express.static(__dirname + '/data'));

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'flower.html'));
});

app.get('/health_check', function (req, res) {
   res.send('alive');
});

var server = app.listen(8080, function () {
   console.log("Flower is listening at http://%s:%s", host, port)
});