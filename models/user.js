module.exports = function (sequelize, DataTypes) {
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNUll: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password:{
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7,30]
			}
		}
	});

}