import cron from 'node-cron';
import Story from '../Models/Story.js';

// Define a cron job to run every hour
const storyCleanUpJob=cron.schedule('11 * * * *', async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now());
    console.log(twentyFourHoursAgo);
    const deletedStories = await Story.deleteMany({ expiryDate: { $lt: twentyFourHoursAgo } });

    console.log(`Deleted ${deletedStories.deletedCount} expired stories.`);
  } catch (error) {
    console.error('Error deleting expired stories:', error);
  }
});
export default storyCleanUpJob;
