const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {});

async function connectMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        return client.db('bolsadecasas');
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectMongoDB;
