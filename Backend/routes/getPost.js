import  express  from "express";
import { fetchPost } from "../controllers/getPost.js";
import protect from "../Middleware/auth.js";
import Post from "../Models/addPost.js";
import { predictSentiment } from "../config/SentimentModel.js";
import Analysis from "../Models/Analysis.js";
import Reputation from "../Models/Repuation.js";


const router=express.Router();
router.get('/getPost',protect,fetchPost);

router.post("/like/:postId", protect, async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;

  try {
    if(Reputation.reputation < 40){
      return res.status(400).json({error:'OOPS!!!Reputaion less than 40. Please work towards positive community'})
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post using Array.find()
    const alreadyLikedIndex = post.likes.findIndex((like) => like.user.toString() === userId.toString());

    if (alreadyLikedIndex !== -1) {
      // User has already liked the post, remove the like
      post.likes.splice(alreadyLikedIndex, 1); // Remove the like from the array
    } else {
      // User has not liked the post, add the like
      post.likes.push({ user: userId });
    }

    await post.save();

    res.status(200).json({ likes: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/comment/:postId", protect, async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;
  const { content } = req.body;

  try {

    if(Reputation.reputation < 50){
      return res.status(400).json({error:'OOPS!!!Reputaion less than 50. Please work towards positive community'})
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const Sentimentprediction = await predictSentiment(content);
    console.log(Sentimentprediction);

    await Analysis.findOneAndUpdate(
      { userId },
      {
        $push: {
          sentimentAnalysis: { $each: [Sentimentprediction.prediction], $position: 0 },
        },
      },
      { upsert: true }
    );


    // Create the comment object
    const comment = {
      user: userId,
      author: req.user.username, // Assuming you have a 'username' field in your user model
      text:content,
      timestamp: new Date(),
    };

    // Add the new comment to the comments array
    post.comments.push(comment);

    await post.save();

    res.status(201).send( post );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getUserPost",protect,async(req,res)=>{
  try{
  const author=req.user.email;
  const posts = await Post.find({author})
  res.status(200).json(posts)
  }catch(e){
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:postId', protect, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userEmail = req.user.email; // Assuming you have stored the user's email in the req.user object after authentication

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the author of the post
    if (post.author !== userEmail) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    // If the post is deleted successfully, send a success response
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/view/:postId', protect, async (req, res) => {
  try {
    const userId = req.user._id; 
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user ID is already in the view array
    if (post.views.includes(userId)) {
      return res.status(400).json({ message: 'User has already viewed this post' });
    }

    // Increment the view count and add the user ID to the views array
    post.views.push(userId);
    post.viewCount = post.views.length;

    // Save the updated post
    await post.save();

    res.status(200).json({ message: 'View count updated successfully' });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
