const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017'; // Local MongoDB
const DB_NAME = 'shopdb';
const PRODUCTS_COLLECTION = 'products';

app.use(express.static('public'));
app.use(express.json());

// Fetch all products from MongoDB
app.get('/api/products', async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const products = await db.collection(PRODUCTS_COLLECTION).find({}).toArray();
    
    await client.close();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
