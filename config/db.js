const Sequelize = require('sequelize');
const fs = require('fs');

const db = new Sequelize('market', 'root', 'nguyenxuanan', {
    dialect: 'mysql',
    host: '34.66.189.170',
    timestamps: false,
    port: 3306,
});

module.exports = db;
