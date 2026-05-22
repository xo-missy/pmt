require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 4000;

global.useLocalDB = false;

// Connect to MongoDB then start server
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
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (using local file-based database)`));
  });
