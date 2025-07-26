import mongoose from "mongoose";
// Define schema for storing image and sentiment analysis data
const AnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegisteredUser',
        required: true
    },
    imageAnalysis: [{
        type: Number,
    }],
    sentimentAnalysis: [{
        type: Number,
    }],
    // Add more fields as needed
});

// Create and export the model
const Analysis = mongoose.model('Analysis', AnalysisSchema);
export default Analysis;
