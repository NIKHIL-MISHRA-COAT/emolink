
import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegisteredUser',
        required: true
    },
    postId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }]
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
