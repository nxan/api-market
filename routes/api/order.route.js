const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Order = require('../../model/order');
const Customer = require('../../model/customers');
const OrderDetail = require('../../model/order_detail');
const Product = require('../../model/products')

Customer.hasOne(Order, { foreignKey: 'customer_id', sourceKey: 'id', as: 'customer' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', targetKey: 'id', as: 'customer' });

Order.hasMany(OrderDetail, { foreignKey: 'order_id', sourceKey: 'id', as: 'order_detail' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id', as: 'order_detail' });

Product.hasOne(OrderDetail, { foreignKey: 'product_id', sourceKey: 'id', as: 'product' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id', as: 'product' });

/* ----- 
  @route  GET v1/customers
  @desc   Get all transaction
-----*/

router.get('/', async (req, res) => {
    try {
        const order = await Order.findAll({
            include: [{
                model: Customer, as: 'customer',
            }, {
                model: OrderDetail, as: 'order_detail',
                include: [{
                    model: Product, as: 'product'
                }],
                attributes: {
                    exclude: ['product_id', 'order_id']
                }
            }],
            attributes: {
                exclude: ['customer_id']
            }
        });   
        res.status(200).json({
            rsp: {
                list: order
            }
        })         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/filter', async (req, res) => {
    try {
        const order = await Order.findAll({
            include: [{
                model: Customer, as: 'customer',
            }, {
                model: OrderDetail, as: 'order_detail',
                include: [{
                    model: Product, as: 'product'
                }],
                attributes: {
                    exclude: ['product_id', 'order_id']
                }
            }],
            attributes: {
                exclude: ['customer_id']
            },
            where: {
                id: req.query.id
            }
        });   
        res.status(200).json({
            rsp: {
                list: order
            }
        })         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});


/* ----- 
  @route  GET v1/customers/filter
  @desc   Get transaction filter by date
  @param  beginDate & endDate
-----*/

router.get('/filter', async (req, res) => {
    try {       
        const order = await Order.findAll({
            where: {
                date: {
                  [Op.between]: [req.query.begindate, req.query.enddate]
                }
            },
            include: [{
                model: Customer, as: 'customer',
            }, {
                model: OrderDetail, as: 'order_detail',
                include: [{
                    model: Product, as: 'product'
                }],
                attributes: {
                    exclude: ['product_id', 'order_id']
                }
            }],
            attributes: {
                exclude: ['customer_id']
            }
        });   
        res.status(200).json({
            rsp: {
                count: order.length,
                list: order
            }
        })         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

/* ----- 
  @route  GET v1/customers/filter
  @desc   Get transaction filter by customer, begindate & enddate
  @param  customer & beginDate & endDate
-----*/

router.get('/filter/customer', async (req, res) => {
    try {       
        const order = await Order.findAll({
            where: {
                date: {
                  [Op.between]: [req.query.begindate, req.query.enddate]
                }, 
                customer_id: req.query.customer_id
            },
            include: [{
                model: Customer, as: 'customer',
            }, {
                model: OrderDetail, as: 'order_detail',
                include: [{
                    model: Product, as: 'product',
                }],
                attributes: {
                    exclude: ['product_id', 'order_id'],                    
                }
            }],
            attributes: {
                exclude: ['customer_id']
            }
        });   
        res.status(200).json({
            rsp: {
                count: order.length,
                list: order
            }
        })         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});



router.post('/', async(req, res) => {
    const {customer_id, order_type, date, note} = req.body;
    
    try {
        console.log(req.body)
        let order = new Order({
            customer_id, order_type, date, note,
            payment: 0,            
        });        
        await order.save()

        var arrayOrderDetail = []

        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                if(key == 'order_detail') {
                    item = req.body[key];
                    arrayOrderDetail = item
                }
            }
        }
        
        Array.from(arrayOrderDetail).forEach((element) => {
            let orderDetail = new OrderDetail({
                order_id: order.id,
                product_id: element.product_id,
                weight: element.weight,
                unit: element.unit,   
                money: element.unit * element.weight                 
            })       
            console.log(orderDetail)     
            orderDetail.save()
        });

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
    const { id, order_type, date, payment, note, customer_id } = req.body;
    var orderFields = {};    
    if (id) orderFields.id = id
    if (order_type) orderFields.order_type = order_type;
    if(date) orderFields.date = date;
    if(payment) orderFields.payment = payment
    if(note) orderFields.note = note
    if(customer_id) orderFields.customer_id = customer_id
    
    try {
        var order = await Order.findOne({
            where: { id: orderFields.id }
        });
        if (order) {
            order.update({
                attributes: ['order_type', 'date', 'payment', 'note'],
                order_type: orderFields.order_type,
                date: orderFields.date,
                payment: orderFields.payment,
                note: orderFields.note,
                customer_id: orderFields.customer_id
            });
        }

        var arrayOrderDetail = []

        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                if(key == 'order_detail') {
                    item = req.body[key];
                    arrayOrderDetail = item                        
                }
            }
        }

        if(arrayOrderDetail) {
            Array.from(arrayOrderDetail).forEach(async (element) => {
                console.log(element)
                var orderdetail = await OrderDetail.findOne({
                    where: { id: element.id }
                })
                if(orderdetail) {
                    orderdetail.update({
                        attributes: ['product_id', 'weight', 'unit', 'money'],
                        product_id: element.product_id,
                        weight: element.weight,
                        unit: element.unit,
                        money: element.weight * element.unit
                    });
                }                    
            });
        }

        return res.status(200).json({
            rsp: {
                status: "ok",
                data: order,
            }                
        })        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/', async (req, res) => {
    try {
        const order = await Order.findOne({
            where: {
                id: req.query.id
              }   
        });

        if (!order) {
            return res.status(404).json({ 
                rsp: {
                    status: "Not found"
                }
            });
        }

        const orderdetail = await OrderDetail.findAll({
            where: {
                order_id: req.query.id
            }
        })                
        
        Array.from(orderdetail).forEach((element) => {
            element.destroy();
        });

        await order.destroy();

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

router.delete('/orderdetail', async (req, res) => {
    try {        
        const orderdetail = await OrderDetail.findOne({
            where: {
                id: req.query.id
            }
        })                                

        orderdetail.destroy()

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