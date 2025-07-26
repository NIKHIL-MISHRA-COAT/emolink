import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String, 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  timeAgo: {
    type: String,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisteredUser", 
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisteredUser",
      },
      author: String,
      text:{
        type: String,
        required:true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  shares: {
    type: Number,
    default: 0,
  },
  views:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
}]
});

const Post = mongoose.model('Post', postSchema);

export default Post;
