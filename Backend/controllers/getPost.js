import Post from "../Models/addPost.js";
import Register from "../Models/User.js";
import Bookmark from "../Models/Bookmarks.js";

export const fetchPost = async (req, res) => {
  try {
    const userId = req.user._id; 
    // Fetch posts and populate 'likes' field with user details
    const posts = await Post.find().populate('likes.user');
    
    // Fetch bookmarks for the user
    const bookmarks = await Bookmark.findOne({ userId }).populate({
      path: 'postId',
      select: '-image' // Exclude the image field from the populated documents
    });

    // Map through the posts and check if each post is bookmarked by the user
    const postsWithProfilePictures = await Promise.all(posts.map(async (post) => {
      const alreadyLiked = post.likes.find((like) => like.user._id.toString() === userId.toString());
      const authorProfile = await Register.findOne({ email: post.author }).select('profilePicture');
      const isViewed = post && post.views.some(viewedUserId => viewedUserId.equals(userId));
      // Check if the post is bookmarked by the user
      const isBookmarked = bookmarks && bookmarks.postId.some(bookmarkedPost => bookmarkedPost._id.equals(post._id));

      return {
        ...post.toObject(),
        isLiked: alreadyLiked !== undefined,
        authorProfilePicture: authorProfile ? authorProfile.profilePicture : null,
        isBookmarked,
        isViewed,
      };
    }));

    res.status(200).json(postsWithProfilePictures);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
