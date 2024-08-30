const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// MySQL connection
const pool = mysql.createPool({
    host: 'bl8erptsedyxj2clufkk-mysql.services.clever-cloud.com',
    user: 'u6dacjrc9g9lpcw4',
    password: '23MI1tUi2PkFnzFNZdXL',
    database: 'bl8erptsedyxj2clufkk'
});

// Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// API endpoints
app.post('/api/v1/locations', (req, res) => {
    const locationData = req.body;
    pool.query('INSERT INTO locations SET ?', locationData, (err, result) => {
        if (err) {
            res.status(500).json({error: 'Failed to save location data'});
        } else {
            res.json({message: 'Location data saved successfully'});
        }
    });
});


app.get('/api/v1/locations', (req, res) => {
    pool.query('SELECT * FROM locations', (err, results) => {
        if (err) {
            res.status(500).json({error: 'Failed to retrieve locations'});
        } else {
            res.json(results);
        }
    });
});

app.get('/api/v1/locations/:trainId', (req, res) => {
    pool.query('SELECT * FROM locations WHERE trainId = ?', [req.params.trainId], (err, results) => {
        if (err) {
            res.status(500).json({error: 'Failed to retrieve location'});
        } else if (results.length === 0) {
            res.status(404).json({error: 'Location not found'});
        } else {
            res.json(results[0]);
        }
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});