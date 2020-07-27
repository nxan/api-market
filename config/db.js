const Sequelize = require('sequelize');
const fs = require('fs');

const db = new Sequelize('market', 'root', 'nguyenxuanan', {
    dialect: 'mysql',
    host: 'localhost',
    timestamps: false,
    port: 3306,
});

module.exports = db;
