const {Sequelize, DataTypes} = require("sequelize");
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.HOST,
        dialect: 'postgres',
        pool:{
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        }
    }
)

async function testConnection(){
    try {
        await sequelize.authenticate()
        console.log('connection established ')
    }
    catch (err){
        console.error(err)
    }
}
testConnection()

const Customer = require('../models/customer')(sequelize,DataTypes)

async function sync (){
    try {
        await sequelize.sync({ alter:true });
        console.log('table sync');
    } catch (err) {
        console.error(err);
    }
};

sync()

module.exports = Customer;
