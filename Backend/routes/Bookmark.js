// routes/bookmark.js
import express from "express";
const Bookmarkrouter = express.Router();
import protect from "../Middleware/auth.js";
import Bookmark from "../Models/Bookmarks.js";



// POST /bookmark - Bookmark a post
Bookmarkrouter.post('/addBookmark', protect, async (req, res) => {
    try {

        const { postId } = req.body;
        const userId = req.user._id;

        // Check if user exists
        const existingBookmark = await Bookmark.findOne({ userId });

        if (existingBookmark) {
            const alreadyBookmarked=await Bookmark.findOne({postId});
            if(alreadyBookmarked){
                existingBookmark.postId.pull(postId);
                await existingBookmark.save();
            }
            else{
                existingBookmark.postId.push(postId);
                await existingBookmark.save();
            }
        } else {
            // Create a new bookmark entry
            const bookmark = new Bookmark({ userId, postIds: [postId] });
            await bookmark.save();
        }

        res.status(201).json({ message: 'Post bookmarked successfully' });
    } catch (error) {
        console.error('Error bookmarking post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

Bookmarkrouter.get('/addBookmark', protect, async (req, res) => {
    try {
        const id = req.user._id;
        const bookmarkPost = await Bookmark.findOne({ userId: id }).populate([
            { path: 'postId' },
            { path: 'userId', select: 'profilePicture' }
        ]);
        res.status(200).json(bookmarkPost);
    } catch (error) {
        console.error('Error fetching bookmarked post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default Bookmarkrouter;
