// Seed script to populate the database with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const Note = require('./server/models/Note');

const sampleUsers = [
  {
    username: 'alice',
    email: 'alice@example.com',
    password: 'password123',
    displayName: 'Alice Wonder',
    bio: 'Love creating colorful notes! 🎨',
  },
  {
    username: 'bob',
    email: 'bob@example.com',
    password: 'password123',
    displayName: 'Bob Builder',
    bio: 'Building connections one note at a time 🔨',
  },
  {
    username: 'charlie',
    email: 'charlie@example.com',
    password: 'password123',
    displayName: 'Charlie Creative',
    bio: 'Artist and dreamer ✨',
  },
];

const sampleNotes = [
  {
    content: 'Welcome to c0lornote! This is a place where creativity meets community. Share your thoughts, connect with others, and express yourself! 🎨',
    color: '#ffffff',
    backgroundColor: '#667eea',
  },
  {
    content: 'Did you know? You can customize the color of your notes to match your mood! Try different colors and make your feed vibrant! 🌈',
    color: '#333333',
    backgroundColor: '#FFD700',
  },
  {
    content: 'Just had the best coffee ☕️ What\'s everyone up to today?',
    color: '#ffffff',
    backgroundColor: '#FF6B6B',
  },
  {
    content: 'Pro tip: Use tags to organize your notes and make them easier to find! #productivity #tips',
    color: '#ffffff',
    backgroundColor: '#4ECDC4',
  },
  {
    content: 'Feeling grateful for this amazing community! Thanks everyone for making this such a welcoming space 💙',
    color: '#333333',
    backgroundColor: '#96CEB4',
  },
  {
    content: 'Just discovered a new favorite feature - the feed shows notes from people I follow! This is awesome! 🎉',
    color: '#333333',
    backgroundColor: '#FFEAA7',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/c0lornote', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Note.deleteMany({});
    console.log('✓ Existing data cleared');

    // Create users
    console.log('👥 Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✓ Created user: ${user.username}`);
    }

    // Create follows
    console.log('🔗 Creating connections...');
    createdUsers[0].following.push(createdUsers[1]._id, createdUsers[2]._id);
    createdUsers[1].following.push(createdUsers[0]._id);
    createdUsers[2].following.push(createdUsers[0]._id, createdUsers[1]._id);

    createdUsers[0].followers.push(createdUsers[1]._id, createdUsers[2]._id);
    createdUsers[1].followers.push(createdUsers[0]._id, createdUsers[2]._id);
    createdUsers[2].followers.push(createdUsers[0]._id);

    for (const user of createdUsers) {
      await user.save();
    }
    console.log('✓ Connections created');

    // Create notes
    console.log('📝 Creating sample notes...');
    for (let i = 0; i < sampleNotes.length; i++) {
      const noteData = sampleNotes[i];
      const author = createdUsers[i % createdUsers.length];
      
      const note = new Note({
        ...noteData,
        author: author._id,
      });
      
      await note.save();
      console.log(`✓ Created note by ${author.username}`);

      // Add some likes
      if (i > 0) {
        const liker = createdUsers[(i + 1) % createdUsers.length];
        note.likes.push(liker._id);
        await note.save();
      }

      // Add some comments
      if (i > 1) {
        const commenter = createdUsers[(i + 2) % createdUsers.length];
        note.comments.push({
          user: commenter._id,
          text: 'Great note! Thanks for sharing! 👍',
        });
        await note.save();
      }
    }

    console.log('✓ Sample notes created');
    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample users created:');
    sampleUsers.forEach(u => {
      console.log(`  - Username: ${u.username}, Password: password123`);
    });
    console.log('\nYou can now login with any of these accounts!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
