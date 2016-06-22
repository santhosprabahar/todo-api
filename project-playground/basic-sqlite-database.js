var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var todo = sequelize.define('todo', {

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

sequelize.sync({
	// force: true
}).then(function() {

	todo.findById(3).then(function (todos){
		if(todos){
			console.log(todos.toJSON());
		}
		else
		{
			console.log("no todo found");
		}
	}).catch(function(error)
	{
		console.log(error);
	});
})



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