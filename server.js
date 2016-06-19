var express = require('express');
var app = express();
var portno = process.env.PORT || 3000;

app.get('/' , function (res, req) {
	res.send("todo api");
});

