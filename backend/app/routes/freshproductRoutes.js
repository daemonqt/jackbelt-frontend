const express = require('express');
const router = express.Router();
const db = require('../database/db.js');
const authenticateToken = require('../authenticator/authentication.js');

router.post('/fresh-products/register', async (req, res) => {
    try {

        const { product_id, freshproductQuantity, user_id  } = req.body;

        const insertUserQuery = 'INSERT INTO freshproducts (product_id, freshproductQuantity, user_id, dateManufactured) VALUES (?, ?, ?, DATE_FORMAT(NOW(), "%m-%d-%Y %h:%i %p"))';
        const [insertFreshProductResult] = await db.promise().execute(insertUserQuery, [product_id, freshproductQuantity, user_id]);
        const freshproduct_id = insertFreshProductResult.insertId;

        const updateQuantityQuery = 'UPDATE products SET productQuantity = productQuantity + ? WHERE product_id = ?';
        await db.promise().execute(updateQuantityQuery, [freshproductQuantity, product_id]);

        res.status(201).json({ message: 'Product quantity increased, updated products' });
    } catch (error) {

        console.error('Error adding quantity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/fresh-products', authenticateToken, async (req, res) => {
    try {

        db.query('SELECT freshproduct_id, product_id, freshproductQuantity, user_id, dateManufactured FROM freshproducts ORDER BY dateManufactured DESC', (err, result) => {

            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading fresh products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/fresh-products/:id', authenticateToken, async (req, res) => {
    
    let freshproduct_id = req.params.id;

    if (!freshproduct_id) {
        return req.status(400).send({ error: true, message: 'Please provide freshproduct_id' });  
    }

    try {

        db.query('SELECT freshproduct_id, product_id, freshproductQuantity, user_id, dateManufactured FROM freshproducts WHERE freshproduct_id = ?', freshproduct_id, (err, result) => {

            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading fresh products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/fresh-products/:id', authenticateToken, async (req, res) => {

    let freshproduct_id = req.params.id;

    const {product_id, freshproductQuantity, user_id} = req.body;

    if (!freshproduct_id || !product_id || !freshproductQuantity || !user_id) {
        return req.status(400).send({ error: user, message: 'Please provide product_id, freshproductQuantity and user_id' });  
    }

    try {

        db.query('UPDATE freshproducts SET product_id = ?, freshproductQuantity = ?, user_id = ?, dateManufactured = DATE_FORMAT(NOW(), "%m-%d-%Y %h:%i %p") WHERE freshproduct_id = ?', [product_id, freshproductQuantity, user_id, freshproduct_id], async (err, result, fields) => {

            if (err) {
                console.error('Error updating items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading fresh product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});

router.delete('/fresh-products/:id', authenticateToken, async (req, res) => {
    
    let freshproduct_id = req.params.id;

    if (!freshproduct_id) {
        return res.status(400).send({ error: true, message: 'Please provide freshproduct_id' });  
    }

    try {

        db.query('DELETE FROM freshproducts WHERE freshproduct_id = ?', freshproduct_id, (err, result, fields) => {

            if (err) {
                console.error('Error deleting items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading fresh product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;