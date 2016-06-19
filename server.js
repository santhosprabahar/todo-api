var express = require('express');
var app = express();
var portno = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'meet mapi for thum',
	completed: false
},
{
	id: 2,
	description: 'meet mapi again for thum',
	completed: false
},
{
	id: 3,
	description: 'meet mapi for thum and gum',
	completed: true
}];


app.get('/' , function (req, res) {
	res.send("todo api");
});

app.get('/todos', function (req, res){
	res.json(todos);
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

