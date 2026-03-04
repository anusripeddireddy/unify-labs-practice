const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// REPLACE WITH YOUR ATLAS CONNECTION STRING
const ATLAS_URI = 'mongodb+srv://blogadmin:yourPassword@cluster0.xxxxx.mongodb.net/zenithblog?retryWrites=true&w=majority';
const client = new MongoClient(ATLAS_URI);
const DB_NAME = 'zenithblog';
const POSTS_COLLECTION = 'posts';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

async function connectDB() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas - Zenith Blog!');
        await client.db(DB_NAME).command({ ping: 1 });
    } catch (error) {
        console.error('❌ Atlas connection failed:', error);
        process.exit(1);
    }
}

// GET /api/posts - All posts
app.get('/api/posts', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const { category, search } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (search) query.title = { $regex: search, $options: 'i' };
        
        const posts = await db.collection(POSTS_COLLECTION)
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/posts/:id
app.get('/api/posts/:id', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const post = await db.collection(POSTS_COLLECTION).findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        res.json({ success: !!post, data: post });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/posts - Create post
app.post('/api/posts', async (req, res) => {
    try {
        const postData = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const db = client.db(DB_NAME);
        const result = await db.collection(POSTS_COLLECTION).insertOne(postData);
        res.json({ success: true, data: { _id: result.insertedId, ...postData } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/posts/:id - Update post
app.put('/api/posts/:id', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const result = await db.collection(POSTS_COLLECTION).updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { 
                    ...req.body, 
                    updatedAt: new Date() 
                } 
            }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/posts/:id
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const result = await db.collection(POSTS_COLLECTION).deleteOne({
            _id: new ObjectId(req.params.id)
        });
        res.json({ success: result.deletedCount > 0 });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🌟 ZENITH Blog API: http://localhost:${PORT}`);
        console.log(`📝 Live on MongoDB Atlas!`);
    });
});
