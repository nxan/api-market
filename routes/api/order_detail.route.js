const express = require('express');
const router = express.Router();

const Order = require('../../model/order');
const Product = require('../../model/products')
const OrderDetail = require('../../model/order_detail')

router.get('/', async (req, res) => {
    try {
        const orderdetail = await OrderDetail.findAll();   
        res.status(200).json({
            rsp: {
                list: orderdetail
            }
        })         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/filter', async (req, res) => {
    try {
        const orderdetail = await OrderDetail.findAll({
            where: {
                order_id: req.query.order_id
            },
            include: [{
                model: Product, as: 'product',
            }]
        });   
        res.status(200).json({
            rsp: {
                list: orderdetail
            }
        })         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/', async(req, res) => {
    const {order_id, product_id, unit, weight} = req.body;
    try {
        console.log(req.body)
        let orderDetail = new OrderDetail({
            order_id: order_id,
            product_id: product_id,
            unit: unit,
            weight: weight,
            money: unit * weight
        })
        await orderDetail.save();
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

router.delete('/', async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findOne({
            where: {
                id: req.query.id
              }   
        });
        if (!orderDetail) {
            return res.status(404).json({ 
                rsp: {
                    status: "Not found"
                }
            });
        }
        await orderDetail.destroy();
        return res.status(200).json({
            rsp: {
                status: "Found",
                message: "Order removed"
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;