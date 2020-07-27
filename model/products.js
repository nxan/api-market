const Sequelize = require('sequelize');
const db = require('../config/db');

const Products = db.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_name: {
        type: Sequelize.STRING
    },    
}, {
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = Products;