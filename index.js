const { MongoClient } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());


// Mongo configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`;
const client = new MongoClient(uri);

// Insert Data to database
async function insertData()
{
    try {
        await client.connect();
        console.log('database connected');
        const dbName = client.db('HeadPhoneStore');
        const headPhoneCollection = dbName.collection('headphones');

        // Get on root
        app.get('/', async (req, res) =>
        {
            res.send('working');
        });

        // Get headphones
        app.get('/shop', async (req, res) =>
        {
            const cursor = headPhoneCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // App listening
        app.listen(port, async (req, res) =>
        {
            console.log('Server running on port: ', port);
        });
    } finally {

    }
}
insertData();
