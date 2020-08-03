const Sequelize = require('sequelize');
const db = require('../config/db');

const Customers = db.define('customers', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullname: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    }, 
    bank_code: {
        type: Sequelize.STRING
    },       
    bank_location: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    card: {
        type: Sequelize.STRING
    }
}, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = Customers;