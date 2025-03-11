const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB!');

    // Create test collections
    const db = mongoose.connection.db;
    await db.createCollection('wishes');
    await db.createCollection('photos');
    await db.createCollection('stories');
    
    console.log('Collections created successfully!');
    console.log('\nAvailable collections:');
    const collections = await db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testConnection();
