require('dotenv').config({ path: require('path').join(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not defined, using default. DO NOT USE IN PRODUCTION.');
  process.env.JWT_SECRET = 'your_super_secret_key_change_this_default';
}

// FIXED: must be set BEFORE requiring app/User model
global.useLocalDB = false;

const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.warn('MongoDB connection error. Falling back to local file-based database...');
    console.warn(`Error details: ${err.message}`);
    global.useLocalDB = true;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (using local DB)`));
  });