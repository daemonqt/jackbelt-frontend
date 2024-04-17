const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const db = require('../database/db.js');
// const secretKey = require('../secretkey/secretkey.js');
const authenticateToken = require('../authenticator/authentication.js');

router.post('/customer/register', async (req, res) => {
    try{
            
        const {name, username} = req.body;

        const insertUserQuery = 'INSERT INTO customers (name, username) VALUES (?, ?)';
        await db.promise().execute(insertUserQuery, [name, username]);

        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        
        console.error('Error registering customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/customers', authenticateToken, async (req, res) => {
    try {

        db.query('SELECT customer_id, name, username FROM customers', (err, result) => {

            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading customers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/customers/count', authenticateToken, async (req, res) => {
    try {
        db.query('SELECT COUNT(*) AS customerCount FROM customers', (err, result) => {
            if (err) {
                console.error('Error fetching customer count:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                const customerCount = result[0].customerCount;
                res.status(200).json({ customerCount });
            }
        });
    } catch (error) {
        console.error('Error loading customer count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/customer/:id', authenticateToken, async (req, res) => {
    
    let customer_id = req.params.id;

    if (!customer_id) {
        return req.status(400).send({ error: true, message: 'Please provide customer_id' });  
    }

    try {

        db.query('SELECT customer_id, name, username FROM customers WHERE customer_id = ?', customer_id, (err, result) => {

            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/customer/:id', authenticateToken, async (req, res) => {

    let customer_id = req.params.id;

    const {name, username} = req.body;

    if (!customer_id || !name || !username) {
        return req.status(400).send({ error: user, message: 'Please provide name and username' });  
    }

    try {

        db.query('UPDATE customers SET name = ?, username = ? WHERE customer_id = ?', [name, username, customer_id], (err, result, fields) => {

            if (err) {
                console.error('Error updating items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});

router.delete('/customer/:id', authenticateToken, async (req, res) => {
    
    let customer_id = req.params.id;

    if (!customer_id) {
        return res.status(400).send({ error: true, message: 'Please provide customer_id' });  
    }

    try {

        db.query('DELETE FROM customers WHERE customer_id = ?', customer_id, (err, result, fields) => {

            if (err) {
                console.error('Error deleting items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;