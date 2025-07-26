import mongoose from 'mongoose';

const reputationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RegisteredUser',
    required: true,
    index: true, // Index for faster query performance
  },
  emopoints: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => value >= 0,
      message: 'EmoPoints must be a non-negative number.',
    },
  },
  reputation: {
    type: Number,
    default: 100,
    validate: {
      validator: (value) => value >= 0,
      message: 'Reputation must be a non-negative number.',
    },
  },
  prevImageCount:{
    type:Number,
  },
  prevSentimentCount:{
    type:Number,
  }
});

// Custom method to update EmoPoints
reputationSchema.methods.updateEmoPoints = async function (points) {
  this.emopoints += points;
  await this.save();
};

// Custom method to update Reputation
reputationSchema.methods.updateReputation = async function (points) {
  this.reputation += points;
  await this.save();
};

const Reputation = mongoose.model('Reputation', reputationSchema);

export default Reputation;
