var express = require('express');
var app = express();
var portno = process.env.PORT || 3000;

app.get('/' , function (req, res) {
	res.send("todo api");
});
app.listen(portno, function()
{
	console.log("server up and running at" + portno);
});

