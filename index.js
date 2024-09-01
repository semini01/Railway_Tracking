const express = require('express');
const {Pool} = require('pg');
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
const bodyParser = require('body-parser');
const cors = require('cors');
const options = {
    definition:{
        openapi: "3.0.0",
        info:{
            title: "Real Time Rain Traking System",
            version:"1.0.0",
            description:"This Application track the live locaion of trains"
        },
    },
    apis:["index.js"]
}

// PostgreSQL connection
const pool = new Pool({
    host: 'bbryhj4grww25kl6jgze-postgresql.services.clever-cloud.com', // PostgreSQL host
    user: 'umijtag0bc7udewpogtr', // PostgreSQL username
    password: '9S7MPvJlKQhSEo3UMO3QE6EixxwW2i', // PostgreSQL password
    database: 'bbryhj4grww25kl6jgze', // PostgreSQL database name
    port: 50013
});
const specs = swaggerJsDoc(options);
// Express app
const app = express();
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))
app.use(cors({origin:'https://railway-tracking-fe.vercel.app/'}));
app.use(bodyParser.json());

// API endpoints
/**
 * @swagger
 * /api/v1/locations:
 *   post:
 *     summary: Save a new train location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               trainid:
 *                 type: integer
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               speed:
 *                 type: number
 *               direction:
 *                 type: string
 *     responses:
 *       200:
 *         description: Location data saved successfully
 *       500:
 *         description: Failed to save location data
 */
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
/**
 * @swagger
 * /api/v1/locations/{trainId}:
 *   put:
 *     summary: Update a train location
 *     parameters:
 *       - name: trainId
 *         in: path
 *         required: true
 *         description: The ID of the train to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               trainid:
 *                 type: integer
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               speed:
 *                 type: number
 *               direction:
 *                 type: string
 *     responses:
 *       200:
 *         description: Location data updated successfully
 *       404:
 *         description: Location not found
 *       500:
 *         description: Failed to update location data
 */
app.put('/api/v1/locations/:trainId', (req, res) => {
    const trainId = req.params.trainId;
    const locationData = req.body;

    const query = 'UPDATE locations SET id=$1, trainid=$2, timestamp=$3, latitude=$4, longitude=$5, speed=$6, direction=$7 WHERE trainId = $8 RETURNING *';
    const values = [locationData.id, trainId, locationData.timestamp, locationData.latitude, locationData.longitude, locationData.speed, locationData.direction, trainId];

    console.log(query.toString())
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

/**
 * @swagger
 * /api/v1/locations:
 *   get:
 *     summary: Get all train locations
 *     responses:
 *       200:
 *         description: List of train locations
 *       500:
 *         description: Failed to retrieve locations
 */
app.get('/api/v1/locations', (req, res) => {
    pool.query('SELECT * FROM locations', (err, results) => {
        if (err) {
            res.status(500).json({error: 'Failed to retrieve locations - ' + err});
        } else {
            res.json(results["rows"]);
        }
    });
});
/**
 * @swagger
 * /api/v1/locations/{trainId}:
 *   get:
 *     summary: Get a specific train location
 *     parameters:
 *       - name: trainId
 *         in: path
 *         required: true
 *         description: The ID of the train to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Train location
 *       404:
 *         description: Location not found
 *       500:
 *         description: Failed to retrieve location
 */
app.get('/api/v1/locations/:trainId', (req, res) => {
    const trainId = req.params.trainId;
    pool.query('SELECT * FROM locations WHERE trainId = $1', [trainId], (err, results) => {
        if (err) {
            res.status(500).json({error: 'Failed to retrieve location - ' + err});
        } else if (results.length === 0) {
            res.status(404).json({error: 'Location not found'});
        } else {
            res.json(results['rows'][0]);
        }
    });
});
/**
 * @swagger
 * /api/v1/trains:
 *   get:
 *     summary: Get all trains
 *     responses:
 *       200:
 *         description: List of trains
 *       500:
 *         description: Failed to retrieve trains
 */
app.get('/api/v1/trains', (req, res) => {
    pool.query('SELECT * FROM trains', (err, results) => {
        if (err) {
            res.status(500).json({error: 'Failed to retrieve trains'});
        } else {
            res.json(results["rows"]);
        }
    });
});
/**
 * @swagger
 * /api/v1/trains/{trainId}:
 *   get:
 *     summary: Get a specific train
 *     parameters:
 *       - name: trainId
 *         in: path
 *         required: true
 *         description: The ID of the train to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Train details
 *       404:
 *         description: Train not found
 *       500:
 *         description: Failed to retrieve train
 */
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