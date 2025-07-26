import express from 'express';
import Post from '../Models/addPost.js';

// Create a Explorerouter instance
const Explorerouter = express.Router();

// Endpoint to fetch the top 3 most liked posts
Explorerouter.get('/top-liked', async (req, res) => {
  try {
    const topLikedPosts = await Post.find().sort({ likes: -1 }).limit(3);
    res.json(topLikedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top liked posts', error: error.message });
  }
});

// Endpoint to fetch the top 3 most commented posts
Explorerouter.get('/top-commented', async (req, res) => {
  try {
    const topCommentedPosts = await Post.find().sort({ comments: -1 }).limit(3);
    res.json(topCommentedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top commented posts', error: error.message });
  }
});

// Endpoint to fetch the top 3 most viewed posts
Explorerouter.get('/top-viewed', async (req, res) => {
  try {
    const topViewedPosts = await Post.find().sort({ views: -1 }).limit(3);
    res.json(topViewedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top viewed posts', error: error.message });
  }
});

// Export the Explorerouter
export default Explorerouter;
