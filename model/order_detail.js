const Sequelize = require('sequelize');
const db = require('../config/db');

const OrderDetail = db.define('order_detail', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: Sequelize.INTEGER
    }, 
    product_id: {
        type: Sequelize.INTEGER
    },
    unit: {
        type: Sequelize.DOUBLE
    },
    weight: {
        type: Sequelize.DOUBLE
    }, 
    money: {
        type: Sequelize.DOUBLE
    }
}, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = OrderDetail;