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
        const reviewCollection = dbName.collection('reviews');
        const cartCollection = dbName.collection('cart');


        // Post api for cart collection
        app.post('/cart', async (req, res) =>
        {
            const product = req.body;
            const find = await cartCollection.findOne({ _id: (product._id) });
            if (!find) {
                const result = await cartCollection.insertOne(product);
                res.send(result);
            }
            res.send({ duplicate: true });
        });

        // Post api for user info
        app.post('/users', async (req, res) =>
        {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        });

        // Post api for headphone
        app.post('/shop', async (req, res) =>
        {
            const newProduct = req.body;
            const result = await headPhoneCollection.insertOne(newProduct);
            res.send(result);
        });


        // Post api for review
        app.post('/reviews', async (req, res) =>
        {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
            console.log(result);
        });


        // Post api for order
        app.post('/orders', async (req, res) =>
        {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });



        // Get api for review
        app.get('/reviews', async (req, res) =>
        {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        // Get on root
        app.get('/', async (req, res) =>
        {
            res.send('Headphone server running');
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
            console.log(email);
            const query = { email: (email) };
            const result = await usersCollection.findOne(query);
            res.send(result);
        });

        // Make admin
        app.put('/users/:email', async (req, res) =>
        {
            const email = req.params.email;
            const query = { email: (email) };
            const updateRole = {
                $set: {
                    role: 'admin'
                }
            };
            const result = usersCollection.updateOne(query, updateRole);
            res.send(result);
        });

        // Get api for all orders
        app.get('/orders', async (req, res) =>
        {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });


        // Get api for orders by user
        app.get('/orders/:email', async (req, res) =>
        {
            const email = req.params.email;
            const query = { email: (email) };
            const result = orderCollection.find(query);
            const makeArray = await result.toArray();
            res.send(makeArray);
        });


        // App listening
        app.listen(port, async (req, res) =>
        {
            console.log('Server running on port: ', port);
        });

        // Delete api
        app.delete('/orders/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });

        // Delete Product
        app.delete('/shop/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await headPhoneCollection.deleteOne(query);
            res.send(result);
        });

        // Update product status
        app.put('/orders/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const newStatus = {
                $set: {
                    status: 'Approved'
                }
            };
            const result = orderCollection.updateOne(query, newStatus);
            res.send(result);
        });

    } finally {

    }
}
insertData();
