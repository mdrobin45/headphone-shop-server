const { MongoClient } = require('mongodb');
ObjectId = require('mongodb').ObjectId,
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
        const usersCollection = dbName.collection('userInfo');
        const orderCollection = dbName.collection('orders');

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

        // Get single headphone
        app.get('/shop/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await headPhoneCollection.findOne(query);
            res.send(result);
        });


        // Get usersInfo
        app.get('/users', async (req, res) =>
        {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });


        // Get single UserInfo
        app.get('/users/:email', async (req, res) =>
        {
            const email = req.params.email;
            const query = { email: (email) };
            const result = await usersCollection.findOne(query);
            res.send(result);
        });

        // Post api for user info
        app.post('/users', async (req, res) =>
        {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        });

        // Post api for order
        app.post('/orders',async(req,res)=>{
            const order= req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })

        // App listening
        app.listen(port, async (req, res) =>
        {
            console.log('Server running on port: ', port);
        });
    } finally {

    }
}
insertData();
