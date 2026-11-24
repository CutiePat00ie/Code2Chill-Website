const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/code2chill';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    global.USE_MEMORY_DB = false;
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB connection to '${uri}' unavailable (${error.message}).`);
    console.log(`⚡ Auto-activating Code2Chill High-Performance In-Memory Data Engine.`);
    console.log(`   (All CRUD operations, Auth, Events, Projects, and Admin actions will work seamlessly!)`);
    global.USE_MEMORY_DB = true;
    
    // Initialize in-memory store with full seed dataset
    const memoryStore = require('../utils/memoryStore');
    memoryStore.initSeed();
    return false;
  }
};

module.exports = connectDB;
