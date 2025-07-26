import cron from 'node-cron';
import moment from 'moment';
import Register from '../Models/User.js';
import Analysis from '../Models/Analysis.js';
import Bookmark from '../Models/Bookmarks.js';
import Chat from '../Models/chatModel.js';
import FriendRequest from '../Models/friendRequest.js';;
import Message from '../Models/Message.js';
import Notification from '../Models/Notification.js';
import Reputation from '../Models/Repuation.js';
import Story from '../Models/Story.js';
import UserActivityDuration from '../Models/userActivity.js';
import DeleteRequest from '../Models/delete.js';;

const deleteUserWholeData = cron.schedule('0 0 * * *', async () => {
  try {
    const cutoffDate = moment().subtract(7, 'days').toDate();

    const oldDeleteRequests = await DeleteRequest.find({ createdAt: { $lte: cutoffDate } });
    for (const deleteRequest of oldDeleteRequests) {
      const email = deleteRequest.email;
      await deleteUserRelatedData(email);
    }
    console.log('Finished Job');

  } catch (error) {
    console.error('Error cleaning up user data:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata',
});

export default deleteUserWholeData;

const deleteUserRelatedData = async (email) => {
  try {
    const user = await Register.findOne({ email });

    if (!user) {
      console.log('User not found.');
      return;
    }

    console.log('Deleting user related data for:', email);

    await Analysis.deleteMany({ userId: user._id });
    await Bookmark.deleteMany({ userId: user._id });
    await Chat.deleteMany({ users: user._id });
    await FriendRequest.deleteMany({ $or: [{ sender: user._id }, { receiver: user._id }] });
    await Message.deleteMany({ sender: user._id });
    await Notification.deleteMany({ sender: user._id });
    await Reputation.deleteMany({ userId: user._id });
    await Story.deleteMany({ userId: user._id });
    await UserActivityDuration.deleteMany({ username: email });


    console.log('User related data deleted successfully.');
  } catch (error) {
    console.error('Error deleting user related data:', error);
  }
};
