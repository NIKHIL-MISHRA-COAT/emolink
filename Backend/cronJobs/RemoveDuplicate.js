import cron from 'node-cron';
import mongoose from 'mongoose';
import Post from '../Models/addPost.js';

const { ObjectId } = mongoose.Types;

const cleanUpDuplicateViewsJob = cron.schedule('46 * * * *', async () => {
  try {
    const posts = await Post.find();

    for (const post of posts) {
      const stringViews = post.views.map(view => view.toString());
      const uniqueViews = [...new Set(stringViews)];

      if (uniqueViews.length !== post.views.length) {
        const duplicateViews = post.views.filter((view, index) => stringViews.indexOf(view.toString()) !== index);
        post.views = uniqueViews.map(view => new ObjectId(view));

        await post.save();


        console.log(`Deleted ${duplicateViews.length} duplicate views for post ${post._id}.`);
      }
    }
    console.log("Finished Job");

  } catch (error) {
    console.error('Error cleaning up duplicate views:', error);
  }
});

export default cleanUpDuplicateViewsJob;
