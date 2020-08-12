const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PrePaid = require('../../model/prepaid');
const Customer = require('../../model/customers');

Customer.hasMany(PrePaid, { foreignKey: 'customer_id', sourceKey: 'id' });
PrePaid.belongsTo(Customer, { foreignKey: 'customer_id', targetKey: 'id' });

router.get('/', async (req, res) => {
    try {
        const prepaid = await PrePaid.findAll({
            include: [{
                model: Customer, as: 'customer',
            }],
            attributes: {
                exclude: ['customer_id']
            }        
        });   
        res.status(200).json({
            rsp: {
                list: prepaid
            }
        })         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/', async(req, res) => {
    const { money, date, customer_id } = req.body;
    
    try {
        console.log(req.body)

        const prepaid = await PrePaid.findOne({
            where: {
                customer_id: customer_id,
                date: (convertUTCDateToLocalDate(new Date(req.body.date)))
              }                 
        });

        if(prepaid) {
            prepaid.update({
                attributes: ['money'],                
                money: parseFloat(prepaid.money) + parseFloat(money)
            });
        } else {
            let prepaid = new PrePaid({
                money, date, customer_id
            })
            await prepaid.save();
        }

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

router.get('/filter', async (req, res) => {
    try {       
        const prepaid = await PrePaid.findAll({
            where: {
                date: {
                  [Op.between]: [(convertUTCDateToLocalDate(new Date(req.query.begindate))), convertUTCDateToLocalDate(new Date(req.query.enddate))]
                }, 
                customer_id: req.query.customer_id
            },
            include: [{
                model: Customer, as: 'customer',
            }],
            attributes: {
                exclude: ['customer_id']
            }
        });   
        res.status(200).json({
            rsp: {
                count: prepaid.length,
                list: prepaid
            }            
        })  
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    console.log(newDate)
    return newDate;   
}


module.exports = router