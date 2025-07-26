import bcrypt from 'bcrypt';
import Register from '../Models/User.js';
import Token from '../Models/token.js';
import { sendEmail } from '../config/sendEmail.js';// Import the sendEmail function
import validator from 'validator';
import crypto from 'crypto';
import Chat from '../Models/chatModel.js';
import UserActivityDuration from '../Models/userActivity.js';
import DeleteRequest from '../Models/delete.js';


export const registerUser = async (req, res) => {
  try {
    // Validate user inputs
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).send("RegistrationError=Invalid Email Address");
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(req.body['password'], 10); // 10 is the number of salt rounds

    // Create a new user with hashed password
    const registerUser = new Register({
      name:req.body['name'],
      username: req.body['email'],
      email: req.body.email,
      password: hashedPassword, // Store the hashed password
    });

    // Generate an authentication token
    const token = await registerUser.generateAuthToken();

    // Create and save the verification token
    const verifyToken = new Token({
      userid: registerUser._id, // Use registerUser._id
      token: crypto.randomBytes(32).toString('hex'),
    });
    await verifyToken.save();

    // Construct the verification URL
    const url = `${process.env.BASE_URL}/users/${registerUser._id}/verify/${verifyToken.token}`;

    // Send a verification email
    await sendEmail(registerUser.email, "Verify Email", url);
    
    // Save the registered user
    await registerUser.save();

    // Set JWT cookie
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    res.cookie("jwt", token, {
      expires: expiryDate,
      httpOnly: true,
    });
   res.status(200).send('Done');
  } catch (e) {
    res.status(404).send(e);
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Find the user by email
    const user = await Register.findOne({ email: email });

    if (!user) {
      return res.send("User not found"); // User not found
    }
    if (user.deactivate===true) {
      user.deactivate = false;
      await user.save();
    }

    const deleteRequest = await DeleteRequest.findOne({ email });

    if (deleteRequest) {
      await DeleteRequest.deleteOne({ email });
    }

    const activity=await UserActivityDuration.find({username:email}).exec();

    if (activity.length>0) {
      const durationInSeconds = activity[activity.length-1].durationInSeconds;
      const userdayOfWeek=activity[activity.length-1].dayOfWeek;
      const todayDay=new Date().getDay();

      // Check if the user has exceeded the daily limit
      if (durationInSeconds > 21600 && todayDay==userdayOfWeek) {
        return res.status(403).send("Daily limit exceeded.Please Login next day");
      }
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, so the user is authenticated

      // Check if the user is verified
      if (!user.verified) {
        const verifyToken = new Token({
          userid: user._id, // Use registerUser._id
          token: crypto.randomBytes(32).toString('hex'),
        });
        await verifyToken.save();
    
        // Construct the verification URL
        const url = `${process.env.BASE_URL}/users/${user._id}/verify/${verifyToken.token}`;
    
        // Send a verification email
        await sendEmail(user.email, "Verify Email", url);
        return res.send("A new verification link has been sent to your email.");
      }

      // Generate a JWT token
      const token = await user.generateAuthToken();
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);


      // Set the JWT token as a cookie
      res.cookie("jwt", token, {
        expires: expiryDate,
        httpOnly: true,
      });

      res.status(200).json({ user });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).send(error.message);
  }
};




export const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};
    
    // Assuming you have a 'Register' model defined
    const users = await Register.find({ ...keyword, _id: { $ne: req.user._id } });

    res.send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};



export const allUsernames = async (req, res) => {
  try {
    const users = await Register.find({ _id: { $ne: req.user._id }, deactivate: { $ne: true } }, '_id username profilePicture');

    const usersWithChatIds = [];

    for (const user of users) {
      const chat = await Chat.findOne({
        $and: [
          { users: req.user._id },
          { users: user._id },
        ],
      });

      // Append chat ID to user data
      const userWithChatId = {
        _id: user._id,
        username: user.username,
        profile:user.profilePicture,
        chatId: chat ? chat._id : null, // Append chat ID if found, otherwise null
      };
      usersWithChatIds.push(userWithChatId);
    }
    res.json(usersWithChatIds);
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).send('Internal Server Error');
  }
};







