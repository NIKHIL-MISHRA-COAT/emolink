import mongoose from "mongoose";
const deleteRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Ensure each delete request is unique by email
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation date
    }
});

const DeleteRequest = mongoose.model('DeleteRequest', deleteRequestSchema);

export default DeleteRequest;