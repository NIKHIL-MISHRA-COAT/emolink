import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bookmark.css'; 
import Logo from '../Home/Images/Logo.png';
import Navbar from '../Home/Navbar/Navbar';

const BookmarkPage = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch bookmarked posts from the backend
    const fetchBookmarkedPosts = async () => {
      try {
        const token = localStorage.getItem('tokenurl');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5000/addBookmark', config);
        setBookmarkedPosts(response.data);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
      }
    };

    fetchBookmarkedPosts();
  }, []);
  console.log(bookmarkedPosts.postId)

  return (
    <>
    <Navbar className="header"/>
    <div className="bookmark-page">
      <h1>Bookmarked Posts</h1>
      {isLoading ? ( // Conditional rendering of loading indicator
        <p>Loading...</p>
      ) : (
        <div className="bookmarked-posts">
          {bookmarkedPosts.postId && bookmarkedPosts.postId.length > 0 ? (
            bookmarkedPosts.postId.map((post) => (
              <div className="bookmarked-post" key={post._id}>
                <div className="post-details">
                  <div className="profile-photo">
                    {bookmarkedPosts.userId.profilePicture ? (
                      <img src={bookmarkedPosts.userId.profilePicture} alt="Profile" />
                    ) : (
                      <img src={Logo} alt="Profile" />
                    )}
                  </div>
                  <div className="author-info">
                    <h3>{post.author}</h3>
                    <small>{post.timestamp}, {post.timeAgo}</small>
                  </div>
                </div>
                <div className="post-image">
                <img src={`data:${post.image.contentType};base64,${btoa(new Uint8Array(post.image.data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`} alt="Post" />
                </div>
                <div className="post-caption">
                  <p>{post.caption}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No bookmarked posts available.</p>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default BookmarkPage;
