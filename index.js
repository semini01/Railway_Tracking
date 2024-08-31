const express = require('express');
const {Pool} = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

// PostgreSQL connection
const pool = new Pool({
    host: 'bbryhj4grww25kl6jgze-postgresql.services.clever-cloud.com', // PostgreSQL host
    user: 'umijtag0bc7udewpogtr', // PostgreSQL username
    password: '9S7MPvJlKQhSEo3UMO3QE6EixxwW2i', // PostgreSQL password
    database: 'bbryhj4grww25kl6jgze', // PostgreSQL database name
    port: 50013
});
// Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// API endpoints
app.post('/api/v1/locations', (req, res) => {
    const locationData = req.body;
    const query = 'INSERT INTO locations (id, trainid, timestamp, latitude, longitude, speed, direction) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [locationData.id, locationData.trainid, locationData.timestamp, locationData.latitude, locationData.longitude, locationData.speed, locationData.direction || null]; // Handle optional direction

    pool.query(query, values, (err, result) => {
        if (err) {
            res.status(500).json({error: 'Failed to save location data - ' + err});
        } else {
            res.json({message: 'Location data saved successfully'});
        }
    });
});

// Update location endpoint
app.put('/api/v1/locations/:trainId', (req, res) => {
    const trainId = req.params.trainId;
    const locationData = req.body;

    const query = 'UPDATE locations SET ? WHERE trainId = $1 RETURNING *';
    const values = [locationData, trainId];

    pool.query(query, values, (err, result) => {
        if (err) {
            res.status(500).json({error: 'Failed to update location data - ' + err});
        } else if (result.affectedRows === 0) {
            res.status(404).json({error: 'Location not found'});
        } else {
            res.json({message: 'Location data updated successfully'});
        }
    });
});

app.get('/api/v1/locations', (req, res) => {
    pool.query('SELECT * FROM locations', (err, results) => {
        if (err) {
            res.status(500).json({error: 'Failed to retrieve locations - ' + err});
        } else {
            res.json(results["rows"]);
        }
    });
});

app.get('/api/v1/locations/:trainId', (req, res) => {
    const trainId = req.params.trainId;
    pool.query('SELECT * FROM locations WHERE trainId = $1', [trainId], (err, results) => {
        if (err) {
            res.status(500).json({error: 'Failed to retrieve location'});
        } else if (results.length === 0) {
            res.status(404).json({error: 'Location not found'});
        } else {
            res.json(results['rows'][0]);
        }
    });
});

app.get('/api/v1/trains', (req, res) => {
    pool.query('SELECT * FROM trains', (err, results) => {
        if (err) {
            res.status(500).json({error: 'Failed to retrieve trains'});
        } else {
            res.json(results);
        }
    });
});

app.get('/api/v1/trains/:trainId', (req, res) => {
    pool.query('SELECT * FROM trains WHERE trainId = ?', [req.params.trainId], (err, results) => {
        if (err) {
            res.status(500).json({error: 'Failed to retrieve train'});
        } else if (results.length === 0) {
            res.status(404).json({error: 'Train not found'});
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