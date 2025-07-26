import cron from 'node-cron';
import Analysis from '../Models/Analysis.js';
import Register from '../Models/User.js';
import Reputation from '../Models/Repuation.js';
const reputation = cron.schedule('0 */6 * * *', async () => {
  try {
    const analysisData = await Analysis.find({});

    for (const data of analysisData) {
      const { userId, imageAnalysis, sentimentAnalysis } = data;

      let reputationData = await Reputation.findOne({ userId });

      if (!reputationData) {
        reputationData = new Reputation({ userId });
      }

      if (reputationData.reputation < 30) {
        await Register.findOneAndUpdate({ _id: userId }, { $set: { freeze: true } });
      }

      if (reputationData.reputation < 5 && reputationData.reputation > 0) {
        continue;
      }


      const prevImageCount = reputationData.prevImageCount || 0;
      const prevSentimentCount = reputationData.prevSentimentCount || 0;
      const currImageCount = imageAnalysis.length;
      const currSentimentCount = sentimentAnalysis.length;

      const imageChange = currImageCount - prevImageCount;
      const sentimentChange = currSentimentCount - prevSentimentCount;

      if (Math.abs(imageChange + sentimentChange) >= 4) {
        const imageZerosPercentage = calculateZerosPercentage(imageAnalysis);
        const sentimentZerosPercentage = calculateZerosPercentage(sentimentAnalysis);

        if (imageZerosPercentage > 30 || sentimentZerosPercentage > 30) {
          await reputationData.updateReputation(-5);
        }

        reputationData.prevImageCount = currImageCount;
        reputationData.prevSentimentCount = currSentimentCount;

        await reputationData.save();
      }
    }
  } catch (error) {
    console.error('Error in reputation cron job:', error);
  }
});

export default reputation;

function calculateZerosPercentage(array) {
  if (!array || array.length === 0) return 0;

  const zerosCount = array.filter(item => item === 0).length;
  return (zerosCount / array.length) * 100;
}
