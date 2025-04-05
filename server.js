const app = require('./app');
const PORT = process.env.PORT || 5000;
const { db } = require('./config/firebase');

// Seed initial data if needed
async function seedData() {
  const competitions = await db.collection('competitions').limit(1).get();
  if (competitions.empty) {
    console.log('Seeding initial competition...');
    await db.collection('competitions').add({
      name: 'Sample Competition',
      description: 'Test competition',
      status: 'registering',
      problems: [],
      createdAt: new Date()
    });
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedData();
});