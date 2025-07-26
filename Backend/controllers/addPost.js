import Post from '../Models/addPost.js';
import Register from '../Models/User.js';
import Analysis from '../Models/Analysis.js';
import { runImageProcessing } from '../config/ImageModel.js';
import { predictSentiment } from '../config/SentimentModel.js';
import Reputation from '../Models/Repuation.js';

export const addPost = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).json({ error: 'Image not provided' });
    }
    if(Reputation.reputation < 70){
      return res.status(400).json({error:'OOPS!!!Reputaion less than 70. Please work towards positive community'})
    }

    // Read the image data and pass it to the image processing function
    const imageData = image.buffer;
    const Imageprediction = await runImageProcessing(imageData);
    console.log(Imageprediction);

    let imageAnalysis;  // Declare the variable outside the if statement

    if (Imageprediction === "Sad") {
      imageAnalysis = 0;
    } else {
      imageAnalysis = 1;
    }

    const Sentimentprediction = await predictSentiment(req.body.caption);
    console.log(Sentimentprediction);

    // Fetch user from Register model based on email
    const email = req.body.email;
    const user = await Register.findOne({ email });
    const author = user ? user.username : 'DefaultAuthor';

    // Update or insert data in the Analysis collection
    await Analysis.findOneAndUpdate(
      { userId: user._id },
      {
        $push: {
          imageAnalysis: { $each: [imageAnalysis], $position: 0 },
          sentimentAnalysis: { $each: [Sentimentprediction.prediction], $position: 0 },
        },
      },
      { upsert: true }
    );

    const postData = {
      author,
      caption: req.body.caption,
      image: {
        data: image.buffer,
        contentType: image.mimetype,
      },
      likes: [],
      comments: [],
      shares: 0,
    };

    const newPost = new Post(postData);
    await newPost.save();

    res.json({ message: 'Post added successfully' });
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
