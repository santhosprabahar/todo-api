var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var user =  sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNUll: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},

		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 30]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var password_hash = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', password_hash);

			}

		}
	}, {

		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}

		},
		classMethods: {


			auhtenticate: function(body) {

				return new Promise(function(resolve, reject) {


					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							// return res.send();
							return reject();
						}
						resolve(user);

					}, function(e) {
						reject();
					});
				});
			}
		},

		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});


	return user;
};