var callr = require('callr');
var express = require('express');
var path = require('path');
var dotenv = require('dotenv');

dotenv.load({ silent: true });
var app = express();

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Flower is listening at http://%s:%s", host, port)
});

var api = new callr.api(process.env.CALLR_ID, process.env.CALLR_PWD);   

var type = 'sms.mo';
var endpoint = 'https://flowerserver-arflower.44fs.preview.openshiftapps.com/sms_webhook';
var options = null;

api.call('webhooks.subscribe', type, endpoint, options).success(function(response) {
    // success callback
});


app.use('/third_party', express.static(__dirname + '/third_party'));
app.use('/data', express.static(__dirname + '/data'));

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'flower.html'));
});

app.get('/health_check', function (req, res) {
   res.send('alive');
});

app.post('/sms_webhook', function (req, res) {
   console.log('sms recieved', req)
   res.sendFile(path.join(__dirname, 'flower.html'));
});

