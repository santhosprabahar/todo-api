var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var portno = process.env.PORT || 3000;
var todonextid = 1;

var todos = [];
app.use(bodyparser.json());


app.get('/' , function (req, res) {
	res.send("todo api");
});

app.get('/todos', function (req, res){
	res.json(todos);
});


app.post('/todos', function (req, res)
{
	var body = req.body;
	// console.log("description" + body.description);
	body.id = todonextid++;
	 todos.push(body);
	res.json(body);
});


app.get('/todos/:id',function (req, res){
	var todoid = parseInt(req.params.id);
	var matchedtodo;
	todos.forEach(function (todo)
	{

		if(todoid === todo.id)
	
		matchedtodo=todo;
	});

	if (matchedtodo)
	{
		res.json(matchedtodo)
	}
	else
	{
		res.status(404).send("404 error");

	}
});
app.listen(portno, function()
{
	console.log("server up and running at port" + portno);
});

