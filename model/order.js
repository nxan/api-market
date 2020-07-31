const Sequelize = require('sequelize');
const db = require('../config/db');

const Order = db.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_id: {
        type: Sequelize.INTEGER
    }, 
    order_type: {
        type: Sequelize.TINYINT
    },    
    date: {
        type: Sequelize.DATE
    }, 
    payment: {
        type: Sequelize.INTEGER
    }, 
    note: {
        type: Sequelize. STRING
    }
}, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = Order;