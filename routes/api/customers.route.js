const express = require('express');
const router = express.Router();
const app = express();
const { Op } = require("sequelize");

const Customers = require('../../model/customers');

router.get('/', async (req, res) => {
    try {
        const customers = await Customers.findAll();   
        res.status(200).json({
            rsp: {
                list: customers
            }
        })         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/test', async (req, res) => {
    console.log("Test ok")
});

router.get('/profile', async (req, res) => {
    try {
        const customers = await Customers.findAll({
            where: {
                id: req.query.id
              }                                    
        });                
        res.status(200).json({
            rsp: {
                list: customers
            }
        })           
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/type', async (req, res) => {
    try {
        const customers = await Customers.findAll({
            where: {
                type: req.query.type
              }                                    
        });                
        res.status(200).json({
            rsp: {
                list: customers
            }
        })           
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/', async(req, res) => {
    const {fullname, phone, bank_code, bank_name, bank_location, type, card} = req.body;
    
    try {
        console.log(req.body)
        let customer = new Customers({
            fullname, phone, bank_code, bank_name, bank_location, type, card
        })
        await customer.save();
        res.status(200).json({
            rsp: {
                status: res.statusCode
            }
        }) 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

router.put('/', async(req, res) => {    
    const { id, fullname, phone, bank_code, bank_location, bank_name, type, card } = req.body;
    var customerField = {};    
    if (id) customerField.id = id
    if (fullname) customerField.fullname = fullname;
    if (phone) customerField.phone = phone;
    if (bank_code) customerField.bank_code = bank_code;
    if (bank_location) customerField.bank_location = bank_location;
    if (bank_name) customerField.bank_name = bank_name;
    if (type) customerField.type = type;
    if (card) customerField.card = card;
    
    try {
        var customer = await Customers.findOne({
            where: { id: customerField.id }
        });
        if (customer) {
            customer.update({
                attributes: ['fullname', 'phone', 'bank_code', 'bank_location', 'bank_name' ,'type', 'card'],
                fullname: customerField.fullname,
                phone: customerField.phone,
                bank_code: customerField.bank_code,
                bank_location: customerField.bank_location,
                bank_name: customerField.bank_name,
                type: customerField.type,
                card: customerField.card
            });
            return res.status(200).json({
                rsp: {
                    status: "ok",
                    data: customer
                }                
            })
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/profile', async (req, res) => {
    try {
        const customer = await Customers.findOne({
            where: {
                id: req.query.id
              }   
        });
        if (!customer) {
            return res.status(404).json({ 
                rsp: {
                    status: "Not found"
                }
            });
        }
        await customer.destroy();
        return res.status(200).json({
            rsp: {
                status: res.statusCode
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;