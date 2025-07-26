
  import express from 'express';
  import bodyParser from 'body-parser';
  import mongoose from 'mongoose';
  import { config } from 'dotenv';
  import cors from 'cors';
  import multer from 'multer';
  import http from 'http';
  import { Server as SocketIOServer } from 'socket.io';
  import auth from './routes/auth.js';
  import addPost from './routes/addPost.js';
  import getPost from './routes/getPost.js';
  import analyticsRouter from './routes/analytics.js';
  import profileRouter from './routes/profile.js';
  import chatRoute from './routes/chatRoutes.js';
  import messageRouter from './routes/messageRoutes.js';
  import setupSocketIO from './config/socket.js';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import { dirname } from 'path';
  import friendRouter from './routes/friendrequest.js';
  import Storyrouter from './routes/addStory.js';
  import notificationrouter from './routes/notification.js';
  import storyCleanUpJob from './cronJobs/storyCleanUp.js';
  import reputation from './cronJobs/repuationData.js';
  import pointsRouter from './routes/points.js';
  import Bookmarkrouter from './routes/Bookmark.js';  
  import cleanUpDuplicateViewsJob from './cronJobs/RemoveDuplicate.js';
  import Explorerouter from './routes/Explore.js';
import deleteUserWholeData from './cronJobs/DeleteUser.js';
  
  config();
  
  const app = express();
  const server = http.createServer(app);
  
  app.use(bodyParser.json());
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  }));
  
  // Define routes after applying CORS middleware
  app.use(auth);
  app.use('/chat', chatRoute);
  app.use('/message', messageRouter);
  app.use('/api/addPost', multer({ storage: multer.memoryStorage() }).single('image'), addPost);
  app.use('/api/getPost', getPost);
  app.use('/analytics', analyticsRouter);
  app.use('/profile', profileRouter);
  app.use('/friendRequests', friendRouter);
  app.use(Storyrouter);
  app.use('/notifications',notificationrouter)
  app.use(pointsRouter);
  app.use(Bookmarkrouter);
  app.use('/explore',Explorerouter);
 
  
  // Set up Socket.io with the server
  const io = new SocketIOServer(server, {
    pingTimeout: 60000,
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
    },
  });
  
  // Call setupSocketIO function
  setupSocketIO(io);
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  app.get('/forgot-pass/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'components/forgotpass', 'forgot.html'));
  });
  
  const CONNECTION_URL = process.env.MONGODB_URI;
  const PORT = process.env.PORT || 5000;
  
  mongoose
    .connect(CONNECTION_URL)
    .then(() => server.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

storyCleanUpJob.start();
reputation.start();
cleanUpDuplicateViewsJob.start();
deleteUserWholeData.start();
  