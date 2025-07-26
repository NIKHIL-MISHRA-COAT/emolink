import express from 'express';
import protect from '../Middleware/auth.js';
import Reputation from '../Models/Repuation.js';
import Register from '../Models/User.js';
import Notification from '../Models/Notification.js';
const pointsRouter = express.Router();

pointsRouter.get("/getpoints", protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch user points
        const userPoints = await Reputation.findOne({ userId });

        // Fetch follower details
        const followerDetails = await Register.findOne({ userId }).select('followers');

        // Fetch notification details
        const notificationDetail = await Notification.findOne({ receiver: userId }).select('receiver');

        // Handle undefined values
        const followersCount = followerDetails?.followers?.length || 0;
        const notificationsCount = notificationDetail?.receiver?.length || 0;

        if (!userPoints) {
            return res.status(404).send({ message: "Points not available for you yet" ,followersCount,notificationsCount});
        }

        res.status(200).send({ userPoints, followersCount, notificationsCount });
    } catch (error) {
        console.error('Error in getting user points:', error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

pointsRouter.post("/redeempoints", protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const redeemPoints = req.body.redeemPoints; // Assuming redeemPoints are sent in the request body

        // Fetch user points and reputation
        const userPoints = await Reputation.findOne({ userId });

        if (!userPoints) {
            return res.status(404).send({ message: "Points not available for redemption yet" });
        }

        // Check if user has enough points to redeem
        if (userPoints.emopoints < redeemPoints) {
            return res.status(400).send({ message: "Insufficient points for redemption" });
        }

        // Check if user's reputation is already at maximum (100)
        if (userPoints.reputation >= 100) {
            return res.status(400).send({ message: "You already have maximum reputation" });
        }

        // Deduct redeemed points from user's total points
        userPoints.emopoints -= redeemPoints;

        // Increase user's reputation by 1 if not already at maximum
        if (userPoints.reputation < 100) {
            userPoints.reputation += 1;
        }

        await userPoints.save();

        // Perform any other necessary actions like updating transaction history, etc.

        res.status(200).send({ message: `${redeemPoints} points redeemed successfully` });
    } catch (error) {
        console.error('Error in redeeming points:', error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


export default pointsRouter;
