import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Explore.css";
import Navbar from "../Home/Navbar/Navbar";

const Explore = () => {
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [topCommentedPosts, setTopCommentedPosts] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        // Fetch top liked posts
        const likedResponse = await axios.get("http://localhost:5000/explore/top-liked");
        console.log(likedResponse.data)
        setTopLikedPosts(likedResponse.data);

        // Fetch top commented posts
        const commentedResponse = await axios.get("http://localhost:5000/explore/top-commented");
        setTopCommentedPosts(commentedResponse.data);

        // Fetch top viewed posts
        const viewedResponse = await axios.get("http://localhost:5000/explore/top-viewed");
        setTopViewedPosts(viewedResponse.data);
      } catch (error) {
        console.error('Error fetching top posts:', error);
      }
    };

    fetchTopPosts();
  }, []);

  return (
    <><Navbar/>
    <div className="explore-container">
      <div className="explore-section">
        <h2>Top 3 Most Liked Posts</h2>
        <div className="top-posts">
          {topLikedPosts.map(post => (
            <div className="post" key={post._id}>
                <img src={`data:${post.image.contentType};base64,${btoa(new Uint8Array(post.image.data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`} alt="Post" />
              <p>{post.caption}</p>
              <div>Likes: {post.likes.length}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="explore-section">
        <h2>Top 3 Most Commented Posts</h2>
        <div className="top-posts">
          {topCommentedPosts.map(post => (
            <div className="post" key={post._id}>
                <img src={`data:${post.image.contentType};base64,${btoa(new Uint8Array(post.image.data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`} alt="Post" />
              <p>{post.caption}</p>
              <div>Comments: {post.comments.length}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="explore-section">
        <h2>Top 3 Most Viewed Posts</h2>
        <div className="top-posts">
          {topViewedPosts.map(post => (
            <div className="post" key={post._id}>
                <img src={`data:${post.image.contentType};base64,${btoa(new Uint8Array(post.image.data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`} alt="Post" />
              <p>{post.caption}</p>
              <div>Views: {post.views.length}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Explore;
