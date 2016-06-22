var express = require('express');
var bodyparser = require('body-parser');
var _ = require("underscore");
var db = require('./db.js');
var app = express();
var portno = process.env.PORT || 3000;
var todonextid = 1;

var todos = [];
app.use(bodyparser.json());


app.get('/', function(req, res) {
	res.send("todo api");
});

app.get('/todos', function(req, res) {
	var queryparams = req.query;
	var where = {};
	if (queryparams.hasOwnProperty('completed') && queryparams.completed === 'true') {
		where.completed = true;
	} else if (queryparams.hasOwnProperty('completed') && queryparams.completed === 'false') {
		where.completed = false;
	}


	if (queryparams.hasOwnProperty('q') && queryparams.q.length > 0) {
		// where.description = "%" + queryparams.q + "%";
		where.description = {
			like : "%" + queryparams.q + "%"
		};
	}


	db.todo.findAll({
		where: where
	}).then(function(todos) {
			res.send(todos);
		},
		function(error) {
			res.status(500).send();
		})
});



//var filteredtodos = todos;
// if (queryparams.hasOwnProperty('completed') && queryparams.completed === 'true') {
// 	filteredtodos = _.where(filteredtodos, {
// 		completed: true
// 	});
// } else if (queryparams.hasOwnProperty('completed') && queryparams.completed === 'false') {

// 	filteredtodos = _.where(filteredtodos, {
// 		completed: false
// 	});

// }

// if (queryparams.hasOwnProperty('q') && queryparams.q.length > 0) {
// 	filteredtodos = _.filter(filteredtodos, function(todo) {
// 		return todo.description.toLowerCase().indexOf(queryparams.q) > -1;
// 	});
// }

// res.send(filteredtodos);

// });


app.post('/todos', function(req, res) {
	var body = _.pick(req.body, "description", "completed");

	db.todo.create(body).then(function(todo) {
		res.send(todo.toJSON());
	}, function(e) {
		res.status(400).send(e);
	});

});

// 	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
// 		return res.status(404).send("404 error");
// 	}


// 	body.description = body.description.trim();
// 	// console.log("description" + body.description);
// 	body.id = todonextid++;
// 	todos.push(body);
// 	res.json(body);
// });


app.delete('/todos/:id', function(req, res) {
	var todoid = parseInt(req.params.id, 10);
	// var matchedtodo;
	var matchedtodo = _.findWhere(todos, {
		id: todoid
	});

	if (!matchedtodo) {
		res.status(404).json({
			"error": "id not found"
		});
	} else {
		todos = _.without(todos, matchedtodo)
		res.send(matchedtodo);
	}

});

app.get('/todos/:id', function(req, res) {
	var todoid = parseInt(req.params.id, 10);


	db.todo.findById(todoid).then(function(todos) {
		if (!!todos) {
			res.send(todos.toJSON());
		} else {
			res.status(404).send("no todo found");
		}
	}, function(error) {
		res.status(500).send();
	});
});
// var matchedtodo;
// matchedtodo= _.findWhere(todos,{id:todoid})

//  // var matchedtodo;
//  // todos.forEach(function (todo)
//  // {

//  // 	if(todoid === todo.id)

//  // 	matchedtodo=todo;
//  // });

//  if (matchedtodo)
//  {
//  	res.json(matchedtodo)
//  }
//  else
//  {
//  	res.status(404).send("404 error");

//  }


app.put('/todos/:id', function(req, res) {

	var todoid = parseInt(req.params.id, 10);
	// var matchedtodo;
	var matchedtodo = _.findWhere(todos, {
		id: todoid
	});
	var body = _.pick(req.body, "description", "completed");
	var validattributes = {};

	if (!matchedtodo) {
		res.status(404).send("error matchedtodo");
	}
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {

		validattributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		res.status(404).send("error at completed object");
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {

		validattributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		res.status(404).send("trim error");
	}

	_.extend(matchedtodo, validattributes);
	res.json(matchedtodo);

});

db.sequelize.sync().then(function() {
	app.listen(portno, function() {
		console.log("server up and running at port" + portno);
	});
});