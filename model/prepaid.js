const Sequelize = require('sequelize');
const db = require('../config/db');

const PrePaid = db.define('prepay', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_id: {
        type: Sequelize.INTEGER
    },
    money: {
        type: Sequelize.DOUBLE
    }, 
    date: {
        type: Sequelize.DATE
    }
}, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = PrePaid;