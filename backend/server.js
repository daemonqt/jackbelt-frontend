const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./app/routes/userRoutes.js');
const productRoutes = require('./app/routes/productRoutes.js');
const customerRoutes = require('./app/routes/customerRoutes.js');
const supplierRoutes = require('./app/routes/supplierRoutes.js');
const orderRoutes = require('./app/routes/orderRoutes.js');
const orderToSupplierRoutes = require('./app/routes/orderToSupplierRoutes.js');
const salesRoutes = require('./app/routes/salesRoutes.js');
const inventoryRoutes = require('./app/routes/inventoryRoutes.js');
const freshproductRoutes = require('./app/routes/freshproductRoutes.js');
const dashboardRoutes = require('./app/routes/dashboardRoutes.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes, customerRoutes, productRoutes, supplierRoutes, orderRoutes, orderToSupplierRoutes, salesRoutes, inventoryRoutes, freshproductRoutes, dashboardRoutes );

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.json({ message: 'Restful API Backend Using ExpressJS' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});