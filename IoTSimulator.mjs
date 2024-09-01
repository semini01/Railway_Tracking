// const {Client} = require('pg');
import pg from 'pg'

const client = new pg.Client({
    host: 'bbryhj4grww25kl6jgze-postgresql.services.clever-cloud.com', // PostgreSQL host
    user: 'umijtag0bc7udewpogtr', // PostgreSQL username
    password: '9S7MPvJlKQhSEo3UMO3QE6EixxwW2i', // PostgreSQL password
    database: 'bbryhj4grww25kl6jgze', // PostgreSQL database name
    port: 50013
});
const locationDataForTrainFour = [
    [4, 4, "2024-08-31T18:10:46.620Z", 6.9334580342837455, 79.8505271107571, 100, "North"],
    [4, 4, "2024-08-31T18:10:46.620Z", 7.330987928419692, 80.30099106080971, 100, "North"],
    [4, 4, "2024-08-31T18:10:46.620Z", 7.257419069576556, 80.59013216706533, 100, "North"],
    [4, 4, "2024-08-31T18:10:46.620Z", 7.233367437941528, 80.59511824688676, 100, "North"],
    [4, 4, "2024-08-31T18:10:46.620Z", 7.2139090192029185, 80.59856864225964, 100, "North"],
    [4, 4, "2024-08-31T18:10:46.620Z", 7.1964856869689235, 80.5982419626714, 100, "North"],
    [4, 4, "2024-08-31T18:10:46.620Z", 7.188846076874595, 80.5931230220986, 100, "North"],
    [4, 4, "2024-08-31T18:10:46.620Z", 6.978216034009152, 81.056461433216, 100, "North"]
];
client.connect()
    .then(async () => {
        console.log('Connected to PostgreSQL');
        for (let key in locationDataForTrainFour) {
            locationDataForTrainFour[key][2]  = new Date();
            client.query('UPDATE locations SET id=$1, trainid=$2, timestamp=$3, latitude=$4, longitude=$5, speed=$6, direction=$7 WHERE trainId = $2 RETURNING *', locationDataForTrainFour[key]);
            console.log(locationDataForTrainFour[key]);
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    })
    .catch(err => {
        console.error('Error connecting to PostgreSQL:', err);
    });