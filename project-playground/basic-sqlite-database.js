var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {

	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	 // force: true
}).then(function() {
	console.log("everything is synced");

	// User.create({
	// 	email: 'santhosprabahar@gmail.com'
	// }).then(function() {
	// 	return Todo.create({
	// 		description: 'fuck u'
	// 	});
	// }).then(function(todo) {
	// 	User.findById(1).then(function(user) {
	// 		user.addTodo(todo);
	// 	});
	// });


	User.findById(1).then(function(user) {
		user.getTodos({where: {completed : false}}).then(function(todos){
			// if(todos){
			todos.forEach(function (todo){
				console.log(todo.toJSON());
				});
			// }else{
			// 	console.log("no todos found");			}
			
		});


	});
});
// 	todo.findById(3).then(function (todos){
// 		if(todos){
// 			console.log(todos.toJSON());
// 		}
// 		else
// 		{
// 			console.log("no todo found");
// 		}
// 	}).catch(function(error)
// 	{
// 		console.log(error);
// 	});
// })



// 	console.log('everything is synced');

// 	todo.create({
// 		description: 'get a trash',
// 		completed: false

// 	}).then(function() {
// 		return todo.create({
// 			description: 'put the value'
// 		});
// 	}).then(function() {
// 		return todo.findAll({
// 			where: {
// 				description: {
// 					$like: '%trash%'
// 				}
// 			}
// 		});

// 	}).then(function(todos) {
// 		if (todos) {
// 			todos.forEach(function(todo) {
// 				console.log(todo.toJSON());
// 			});
// 		} else {
// 			console.log('no todo found');
// 		}
// 	}).catch(function(e) {
// 		console.log(e);
// 	});
// });