var express = require('express');
var bodyparser = require('body-parser');
var _ = require("underscore");
var app = express();
var portno = process.env.PORT || 3000;
var todonextid = 1;

var todos = [];
app.use(bodyparser.json());


app.get('/' , function (req, res) {
	res.send("todo api");
});

app.get('/todos', function (req, res){
	res.send(todos);
});


app.post('/todos', function (req, res)
{	
	var body = _.pick(req.body,"description", "completed");
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)
	{
		return res.status(404).send("404 error");
	}


	body.description= body.description.trim();
	// console.log("description" + body.description);
	body.id = todonextid++;
	 todos.push(body);
	res.json(body);
});


app.delete('/todos/:id', function (req, res){
	var todoid = parseInt(req.params.id, 10);
	var matchedtodo;
	matchedtodo = _.findWhere(todos, {id:todoid});

	if(!matchedtodo)
	{
		res.status(404).json({"error": "id not found"});
	}else
	{
		todos = _.without(todos, matchedtodo)
		res.send(matchedtodo);
	}
	
});

app.get('/todos/:id',function (req, res){
	var todoid = parseInt(req.params.id, 10);
	var matchedtodo;
	matchedtodo= _.findWhere(todos,{id:todoid})

	 // var matchedtodo;
	 // todos.forEach(function (todo)
	 // {

	 // 	if(todoid === todo.id)
	
	 // 	matchedtodo=todo;
	 // });

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

