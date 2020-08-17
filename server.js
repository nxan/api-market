const express = require('express');
const db = require('./config/db');

const app = express();

const {Storage} = require('@google-cloud/storage');

const storage = new Storage();
async function listBuckets() {
  try {
    const results = await storage.getBuckets();

    const [buckets] = results;

    console.log('Buckets:');
    buckets.forEach((bucket) => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}
listBuckets();

db.authenticate()
  .then(() => console.log('Database connected....'))
  .catch(err => console.log('Error' + err))

app.use(
    express.json({
        extended: true
    })
);

app.use('/v1/customers', require('./routes/api/customers.route'))
app.use('/v1/products', require('./routes/api/products.route'))
app.use('/v1/prepaid', require('./routes/api/prepaid.route'))
app.use('/v1/order', require('./routes/api/order.route'))
app.use('/v1/orderdetail', require('./routes/api/order_detail.route'))

app.use((req, res, next) => {
  const err = new Error('Not found!');
  err.status = 404;
  next(err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));