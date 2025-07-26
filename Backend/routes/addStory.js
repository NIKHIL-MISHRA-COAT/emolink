// routes/addStory.js
import express from 'express';
import multer from 'multer';
import Story from '../Models/Story.js';
import protect from '../Middleware/auth.js';

const Storyrouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


Storyrouter.post('/addStory', protect, upload.single('stories'), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const userId=req.user._id;
    const type=mimetype.split('/')[0]
    const newStory = new Story({
      userId,
      type,
      filename: originalname,
      path: buffer.toString('base64'), // Save file content as base64 string
      mimetype,
    });

    await newStory.save();
    res.status(201).json({ message: 'Story added successfully' });
  } catch (error) {
    console.error('Error adding story:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

Storyrouter.get('/addStory', async (req, res) => {
    try {
      const stories = await Story.find().populate({
        path: 'userId',
        model: 'RegisteredUser', 
        select: 'username profilePicture' ,
        match: {
          $or: [
              { deactivate: { $exists: false } }, // Documents without the deactivate field
              { deactivate: false } // Documents with deactivate field set to false
          ]}
      });      res.json({ stories });
    } catch (error) {
      console.error('Error fetching stories:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  Storyrouter.delete('/deleteStory', protect, async (req, res) => {
    try {
      const id = req.user._id; // Assuming req.user contains the authenticated user's information
      const filename = req.body.filename; // Assuming filename is sent in the request body
  
      // Find the story to delete
      const storyToDelete = await Story.findOneAndDelete({ filename, userId: id });
      
      if (!storyToDelete) {
        return res.status(404).json({ message: "Story not found" });
      }
  
      return res.status(200).json({ message: "Story deleted successfully" });
    } catch (error) {
      console.error('Error deleting story:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  

export default Storyrouter;
