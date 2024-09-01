const {Client} = require('pg');

const client = new Client({
    host: 'bbryhj4grww25kl6jgze-postgresql.services.clever-cloud.com', // PostgreSQL host
    user: 'umijtag0bc7udewpogtr', // PostgreSQL username
    password: '9S7MPvJlKQhSEo3UMO3QE6EixxwW2i', // PostgreSQL password
    database: 'bbryhj4grww25kl6jgze', // PostgreSQL database name
    port: 50013
});

const locationsData = [
    [1, 1, "2024-08-31 05:03:06.06", 9.62183241321732, 79.8939970732606960, 100, "North"],
    [2, 2, "2024-08-31 05:05:26.06", 4.85132569577422, 80.0688847294524560, 100, "North"],
    [3, 3, "2024-08-31 05:08:45.07", 1.08317024729978, 80.55984293974895100, 100, "North"],
    [4, 4, "2024-08-31 18:10:46.62", 4.693612383896735, 79.8536353632470759, 100, "North"]
]
const trainData = [
    [1, "Dunhinda Odyssey", "Colombo Fort - Badulla", "Active", "2024-08-31 04:54:07.028056"],
    [2, "Express Train", "Maradana - Beliatta", "Active", "2024-08-31 04:56:08.038058"],
    [3, "Express Train", "Maradana - Mathara", "Active", "2024-08-31 04:56:38.04"],
    [4, "Podi Menike", "Colombo Fort - Badulla", "Active", "2024-08-31 04:58:57.0"]
];
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL');
        const values = [123, 1, new Date(), 40.7128, -74.0060, 50, 'North'];
        for (let key in trainData) {
            client.query('INSERT INTO trains (trainid,name,route,status,lastseentimestamp) VALUES ($1, $2, $3, $4, $5)', trainData[key]);
        }
        for (let key in locationsData) {
            client.query('INSERT INTO locations (id,trainid,timestamp,latitude,longitude,speed,direction) VALUES ($1, $2, $3, $4, $5,$6,$7)', locationsData[key]);
        }
    })
    .catch(err => {
        console.error('Error connecting to PostgreSQL:', err);
    });