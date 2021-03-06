var express = require('express');
var bodyparser = require('body-parser');
var _ = require("underscore");
var bcrypt = require('bcrypt')
var db = require('./db.js');
var middleware = require('./middleware.js')(db);
var app = express();
var portno = process.env.PORT || 3000;
var todonextid = 1;



var todos = [];
app.use(bodyparser.json());


app.get('/', function(req, res) {
	res.send("todo api");
});



app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var queryparams = req.query;
	var where = {
		userId: req.user.get('id')
	};
	if (queryparams.hasOwnProperty('completed') && queryparams.completed === 'true') {
		where.completed = true;
	} else if (queryparams.hasOwnProperty('completed') && queryparams.completed === 'false') {
		where.completed = false;
	}


	if (queryparams.hasOwnProperty('q') && queryparams.q.length > 0) {
		// where.description = "%" + queryparams.q + "%";
		where.description = {
			like: "%" + queryparams.q + "%"
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


app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, "description", "completed");

	db.todo.create(body).then(function(todo) {
		// res.send(todo);
		req.user.addTodo(todo).then(function() {
			return todo.reload();
		}).then(function(todo) {
			res.send(todo);
		});
	}, function(e) {
		res.status(400).send(e);
	});

});

// 	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
// 		return res.status(404).send("404 error");
// 	}

// middleware.requireAuthentication,
// 	body.description = body.description.trim();
// 	// console.log("description" + body.description);
// 	body.id = todonextid++;
// 	todos.push(body);
// 	res.json(body);
// });


app.delete('/todos/:id',middleware.requireAuthentication, function(req, res) {
	var todoid = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoid,
			userId: req.user.get('id')
		}
	}).then(function(rowsdeleted) {
		if (rowsdeleted === 0) {
			res.status(404).json({
				error: 'no todo found'
			});
		} else {
			res.status(204).send();
		}
	}, function(e) {
		res.status(500).send();
	});


});

// var matchedtodo;
// var matchedtodo = _.findWhere(todos, {
// 	id: todoid
// });

// if (!matchedtodo) {
// 	res.status(404).json({
// 		"error": "id not found"
// 	});
// } else {
// 	todos = _.without(todos, matchedtodo)
// 	res.send(matchedtodo);
// }



app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoid = parseInt(req.params.id, 10);


	db.todo.findOne({
		where: {
			id: todoid,
			userId: req.user.get('id')
		}
	}).then(function(todos) {
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


app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {

	var todoid = parseInt(req.params.id, 10);
	// var matchedtodo;
	// var matchedtodo = _.findWhere(todos, {
	// 	id: todoid
	// });
	var body = _.pick(req.body, "description", "completed");
	var attributes = {};

	// if (!matchedtodo) {
	// 	res.status(404).send("error matchedtodo");

	if (body.hasOwnProperty('completed')) {

		attributes.completed = body.completed;
	}
	if (body.hasOwnProperty('description')) {

		attributes.description = body.description;
	}

	db.todo.findOne({
		where: {
			id: todoid,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
		if (todo) {
			return todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).send();
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});
});


app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(e) {
		res.status(400).send(e);
	});
});
// } else if (body.hasOwnProperty('description')) {
// 	res.status(404).send("trim error");
// }

// _.extend(matchedtodo, validattributes);
// res.json(matchedtodo);


app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;


	db.user.authenticate(body).then(function(user) {
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token: token
		});
	}).then(function (tokenInstance){
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function(){
			res.status(401).send();
	});
		// if (token) {
		// 	res.header('Auth', token).json(user.toPublicJSON());
		// } else {
		// 	res.status(401).send(e);
		// }

	
	// } else {
	// 	res.status(404).send();
	// }
});

app.delete('/users/login', middleware.requireAuthentication, function (req,res){
	req.token.destroy().then(function (){
		res.status(204).send();
	}).catch(function (){
		res.status(500).send();
	});
});


db.sequelize.sync({
	  // force: true
}).then(function() {
	app.listen(portno, function() {
		console.log("server up and running at port" + portno);
	});
});