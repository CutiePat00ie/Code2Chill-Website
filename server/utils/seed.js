require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Project = require('../models/Project');
const TeamMember = require('../models/TeamMember');
const Announcement = require('../models/Announcement');
const seedData = require('./seedData');

const seedDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/code2chill';

  try {
    console.log(`🌱 Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB.');

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany();
    await Event.deleteMany();
    await Project.deleteMany();
    await TeamMember.deleteMany();
    await Announcement.deleteMany();

    console.log('📥 Seeding Users...');
    const users = await User.insertMany(
      seedData.usersData.map(u => ({
        ...u,
        _id: new mongoose.Types.ObjectId()
      }))
    );

    console.log('📥 Seeding Events...');
    const events = await Event.insertMany(
      seedData.eventsData.map(e => ({
        ...e,
        _id: new mongoose.Types.ObjectId()
      }))
    );

    console.log('📥 Seeding Projects...');
    await Project.insertMany(
      seedData.projectsData.map(p => ({
        ...p,
        _id: new mongoose.Types.ObjectId(),
        submittedBy: users[0]._id
      }))
    );

    console.log('📥 Seeding Team Members...');
    await TeamMember.insertMany(
      seedData.teamMembersData.map(t => ({
        ...t,
        _id: new mongoose.Types.ObjectId()
      }))
    );

    console.log('📥 Seeding Announcements...');
    await Announcement.insertMany(
      seedData.announcementsData.map(a => ({
        ...a,
        _id: new mongoose.Types.ObjectId()
      }))
    );

    console.log('🎉 Code2Chill database seeded successfully with rich sample data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
