const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;

// UPDATE WITH YOUR ATLAS CONNECTION STRING
const ATLAS_URI = 'mongodb+srv://shopadmin:password@cluster0.xxxxx.mongodb.net/titanmarket?retryWrites=true&w=majority';
const client = new MongoClient(ATLAS_URI);
const DB_NAME = 'titanmarket';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

async function connectDB() {
    await client.connect();
    console.log('✅ TITAN Marketplace connected to Atlas!');
}

// PRODUCTS API
app.get('/api/products', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const { category, minPrice, maxPrice, search } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        
        const products = await db.collection('products')
            .find(query)
            .sort({ name: 1 })
            .toArray();
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// CART API (LocalStorage + API sync)
app.post('/api/cart/add', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const { productId, quantity } = req.body;
        const result = await db.collection('orders').insertOne({
            type: 'cart',
            productId,
            quantity,
            timestamp: new Date(),
            userId: 'guest_' + Date.now() // Simple guest tracking
        });
        res.json({ success: true, cartId: result.insertedId });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.get('/api/cart', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const cartItems = await db.collection('orders')
            .find({ type: 'cart' })
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();
        res.json({ success: true, data: cartItems });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ORDERS API
app.post('/api/orders', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const orderData = {
            ...req.body,
            status: 'pending',
            orderDate: new Date(),
            userId: 'guest_' + Date.now()
        };
        const result = await db.collection('orders').insertOne({
            type: 'order',
            ...orderData
        });
        res.json({ success: true, orderId: result.insertedId });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🛒 TITAN Marketplace: http://localhost:${PORT}`);
    });
});
