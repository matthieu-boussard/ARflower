var bodyParser = require('body-parser');
var callr = require('callr');
var express = require('express');
var path = require('path');
var dotenv = require('dotenv');
var doT = require('dot');
var fs = require('fs');
var _ = require('lodash');

doT.templateSettings.strip = false;
dotenv.load({ silent: true });
var app = express();
app.use(bodyParser.json())

var tempFn = ''
var callr_text= 'Hi there'

var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   fs.readFile( __dirname + '/sms.html', function (err, data) {
   	tempFn = doT.template(data);
   });
   console.log("Flower is listening at http://%s:%s", host, port)
});

var api = new callr.api(process.env.CALLR_ID, process.env.CALLR_PWD);   

var type = 'sms.mo';
var endpoint = 'https://flowerserver-arflower.44fs.preview.openshiftapps.com/sms_webhook';
var options = null;

api.call('webhooks.subscribe', type, endpoint, options).success(function(response) {
    // success callback
});

var optionSMS = {
    webhook: {
        endpoint: endpoint
    }
};

app.use('/third_party', express.static(__dirname + '/third_party'));
app.use('/data', express.static(__dirname + '/data'));

app.get('/', function (req, res) {
   res.send(tempFn({sms_text: callr_text}));
});

app.get('/flower', function (req, res) {
	res.sendFile(path.join(__dirname, 'flower.html'));
});

app.get('/health_check', function (req, res) {
	res.status('200').send('up');
});

app.post('/send_sms', function (req, res) {
	api.call('sms.send', '', '+33768399556', 'Welcome to AR flower', optionSMS).success(function(response) {
		res.send('sent')
	});
});

app.post('/sms_webhook', function (req, res) {
   console.log('sms recieved', req.body);
   if (!_.isUndefined(req.body.data) && (req.body.type =='sms.mo')) {
   	    console.log('Setting new sms data to :', req.body.data.text)
   		callr_text = req.body.data.text;
   }
   res.send('new text set');
});

