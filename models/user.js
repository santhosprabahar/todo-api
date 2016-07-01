var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
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
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject('body error');
					}


					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							// return res.send();
							return reject('validate error');
						}
						resolve(user);

					}, function(e) {
						reject();
					});
				});
			},

			FindByToken: function(token) {
				return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, 'qwert123%%');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123$$');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						user.findById(tokenData.id).then(function(user) {
							if (user) {
								resolve(user);
							} else {
								reject();
							}
						}, function(e) {
							reject();
						});
					} catch (e) {
						reject();
					}
				});
			}
		},

		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					return undefined;
				}

				try {
					var stringData = JSON.stringify({
						id: this.get('id'),
						type: type
					});
					var ecnryptedData = cryptojs.AES.encrypt(stringData, 'abc123$$').toString();
					var token = jwt.sign({
						token: ecnryptedData
					}, 'qwert123%%');

					return token;
				} catch (e) {
					console.error(e);
					return undefined;
				}



			}
		}

	});


	return user;
};