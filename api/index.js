require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../backend/app');

// Fallback JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not defined. Falling back to default.');
  process.env.JWT_SECRET = 'your_super_secret_key_change_this_default';
}

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
  
  try {
    const db = await mongoose.connect(uri);
    console.log('Connected to MongoDB in Serverless context');
    cachedDb = db;
    return cachedDb;
  } catch (error) {
    console.error('Error connecting to database', error);
  }
}

module.exports = async (req, res) => {
  if (!global.useLocalDB) {
     await connectToDatabase();
  }
  return app(req, res);
};
