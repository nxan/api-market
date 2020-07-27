const express = require('express');
const router = express.Router();

const Products = require('../../model/products');

router.get('/', async (req, res) => {
    try {
        const products = await Products.findAll();   
        res.status(200).json({
            rsp: {
                list: products
            }
        })         
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/', async(req, res) => {
    const {product_name} = req.body;
    
    try {
        console.log(req.body)
        let product = new Products({
            product_name: product_name
        })
        await product.save();
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
        const product = await Products.findOne({
            where: {
                id: req.query.id
              }   
        });
        if (!product) {
            return res.status(404).json({ 
                rsp: {
                    status: "Not found"
                }
            });
        }
        await product.destroy();
        return res.status(200).json({
            rsp: {
                status: "Found",
                message: "Product removed"
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;