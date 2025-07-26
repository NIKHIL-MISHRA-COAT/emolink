import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../Home/Navbar/Navbar.js';
import Logo from '../Home/Images/Logo.png';
import { fetchProfileData, updateBio } from '../../api/index.js';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsPencil, BsFillXCircleFill } from 'react-icons/bs';
import ProfileImageCropper from './ProfileImageCropper.js';
// import Feeds from '../Home/Main/Feeds/feeds.js';
// import Bookmark from '../Bookmark/Bookmark.js';

const Profile = () => {
  const { username: profileUsername } = useParams();
  const loggedInUsername = localStorage.getItem('token');

  const [userData, setUserData] = useState({
    followers: [0],
    following: [0],
    posts: 0,
    username: '',
    fullName: '',
    userImage: '',
    bio: '',
    id: '',
  });
  const navigate = useNavigate();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');

  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [posts, setpost] = useState([]);
  const [pi, setPi] = useState({ Logo })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = profileUsername || loggedInUsername;

        const response = await fetchProfileData(username);
        setUserData(response);
        setPi(response.profile);
        setEditedBio(response.bio);

        // Check if the response includes the user's email address from localStorage
        const userEmail = localStorage.getItem('token');
        const isUserEmailInResponse = response.followers.users.some(user => user.username === userEmail);

        if (isUserEmailInResponse) {
          setFriendRequestSent(true);
        } else {
          // Check if friend request has been sent
          const friendRequests = await axios.get(`http://localhost:5000/friendRequests/friend-requests/${response.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('tokenurl')}`,
            },
          });

          const sentRequest = friendRequests.data.find(
            (request) => request.receiver._id === response._id && request.status === 'pending'
          );

          setFriendRequestSent(!!sentRequest);
        }
      } catch (error) {
        navigate('/profile');
        Swal.fire({
          title: 'User Not Found',
          text: error.response.data.message,
          icon: 'warning',
        });
      }
    };

    const fetchUserPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getpost/getUserPost`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenurl')}`,
          },
        });
        setpost(response.data);
      }
      catch (e) {
        console.log(e);
      }
    }
    fetchUserPost()
    fetchData();

  }, [profileUsername, loggedInUsername, navigate]);

  const handleEditBio = () => {
    setIsEditingBio(true);
  };
  const handleSaveBio = async () => {
    try {
      const username = profileUsername || loggedInUsername;
      await updateBio(username, editedBio);

      setUserData((prevData) => ({
        ...prevData,
        bio: editedBio,
      }));

      setIsEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };
  let isOwnProfile = false;
  if (profileUsername === undefined) {
    isOwnProfile = true;
  } else if (profileUsername === loggedInUsername) {
    isOwnProfile = true
  } else {
    isOwnProfile = false;
  }

  const username = localStorage.getItem('token');

  const handleAddFriend = async () => {
    try {
      const response = await axios.post('http://localhost:5000/friendRequests/send-request', {
        senderEmail: username,
        receiverEmail: profileUsername, // Assuming profileUsername is the user ID
      });

      Swal.fire({
        title: 'Request sent',
        text: response.data.message,
        icon: 'success',
      }); // Message from the backend
      setFriendRequestSent(true)
    } catch (error) {

      console.error('Error sending friend request:', error);
    }
  };

  // ------------------------------------------------------------------
  const [ispop, setpop] = useState(false);
  var [heading, setHeading] = useState(null);
  const [popButtonLabel, setPopButtonLabel] = useState(null);
  const handleFollowerCountClick = () => {
    setHeading("Followers")
    setPopButtonLabel("Remove")
    setpop(true);
  };
  const handleFollowingCountClick = () => {
    setHeading("Following")
    setPopButtonLabel("Unfollow")
    setpop(true);
  };

  const closeModal = () => {
    setpop(false);
    // setPopButtonLabel(null)
  };
  const handleFollowerRemove = async (id) => {
    const token = localStorage.getItem('tokenurl');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `http://localhost:5000/profile/removeUser/${id}`,
        {},
        config
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error removing follower:', error);
    }
  };

  const handleFollowingUnfollow = async (id) => {
    const token = localStorage.getItem('tokenurl');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `http://localhost:5000/profile/unfollowUser/${id}`,
        {},
        config
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error unfollowing follower:', error);
    }
  }
  const handleBottomAction = (id) => {
    if (popButtonLabel === "Remove") {
      handleFollowerRemove(id);
    }


    if (popButtonLabel === "Unfollow") {
      handleFollowingUnfollow(id);
    }

  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleDeletePost = async (postId) => {
    try {
      // Send a request to delete the post
      const response = await axios.delete(`http://localhost:5000/api/getpost/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tokenurl')}`,
        },
      });

      // Update the UI by removing the deleted post from the list of posts
      setpost((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      Swal.fire({
        title: 'Delete Success',
        text: response.data.message, // Use response.data.message for success message
        icon: 'success',
      });
    } catch (error) {
      // Handle error message from server response
      let errorMessage = 'Failed to delete post';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        title: 'Delete failed',
        text: errorMessage,
        icon: 'error',
      });
      console.error('Error deleting post:', error);
    }
  };

  // Function to call handleDeletePost with postId
  const handleClickDeletePost = (postId) => {
    handleDeletePost(postId);
  };
  const handleReportPost = () => {
    console.log("Reporting Post");
  }

  // ----------
  const [isProfileFileInputOpen, setProfileFileInputOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleProfileFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("hii: ", selectedFile)
    if (selectedFile) {
      const imgSrc = URL.createObjectURL(selectedFile);
      setSelectedImage(imgSrc);
      // setFileInputOpen(true);
    }
  };

  const handleImageCropper = async (croppedImageUrl) => {

    try {
      const token = localStorage.getItem('tokenurl');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // Send a POST request to update the profile picture
      const response = await axios.post(
        'http://localhost:5000/ChangeProfile',
        { profilePicture: croppedImageUrl },
        config
      );

      console.log('Profile picture updated:');

      setSelectedImage(null);
      setPi(croppedImageUrl);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  // --------

  return (
    <>
      <div>
        <Navbar />
        <div className=' container profile-container'>
          <div className='profile'>
            <div className='profile-image'>
              <span><img className='user-image' src={pi} alt='User' /></span>
              <span class="edit-button">
                <label for="profile-image" >
                  <BsPencil className='pencil' />
                  <input id="profile-image" type="file" accept="image/*" name="image" onChange={handleProfileFileChange} style={{ display: 'none' }} />
                </label>
                {selectedImage && (
                  <ProfileImageCropper imgSrc={selectedImage} onComplete={handleImageCropper} />
                )}
              </span>

            </div>

            <div className='profile-info'>
              <div className='user-details'>
                <span className='original-name'>{userData.fullName}</span>
                <h4 className='user-name'>{userData.username}</h4>
              </div>
              <div className='numbers'>
                <a onClick={handleFollowerCountClick} className='num'>
                  <div>{userData.followers.count}</div>
                  <h4>followers</h4>
                </a>
                <a onClick={handleFollowingCountClick} className='num'>
                  <div>{userData.following.count}</div>
                  <h4>following</h4>
                </a>
                <a className='num'>
                  <div>{userData.posts}</div>
                  <h4>posts</h4>
                </a>
                {ispop && (
                  <div className="pop">
                    <div className="pop-content">
                      <div className='pop-header'>
                        <h4>Number of {heading}: {heading === "Followers" ? userData.followers.count : userData.following.count}</h4>
                        <span className="close" onClick={closeModal}>
                          <BsFillXCircleFill />
                        </span>
                      </div>
                      <div className='pop-bottom'>
                        {/* Render followers if heading is "Followers" */}
                        {heading === "Followers" && userData.followers.users.map((follower) => {
                          return (
                            <div className='pop-entry' key={follower.id}>
                              <span><img className='user-image' src={Logo} alt='User' /></span>
                              <div className='user-name'>{follower.username}</div>
                              <div>
                                {isOwnProfile && (
                                  <button className='pop-bottom-button' value={popButtonLabel} onClick={() => handleBottomAction(follower.id)}>
                                    {popButtonLabel}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Render following if heading is "Following" */}
                        {heading === "Following" && userData.following.users.map((following) => {
                          return (
                            <div className='pop-entry' key={following.id}>
                              <span><img className='user-image' src={Logo} alt='User' /></span>
                              <div className='user-name'>{following.username}</div>
                              <div>
                                {isOwnProfile && (
                                  <button className='pop-bottom-button' value={popButtonLabel} onClick={() => handleBottomAction(following.id)}>
                                    {popButtonLabel}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <hr className='hr' />
            </div></div>
          <div className='profile-bottom'>
            <div className='left-about'>
              {isEditingBio ? (
                <>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows={4}
                    cols={50}
                  />
                  <button onClick={handleSaveBio}>Save</button>
                </>
              ) : (
                <>
                  <ul>
                    <li className='uil uil-home'>{userData.bio}</li>
                  </ul>
                  {isOwnProfile && (
                    <button onClick={handleEditBio} className='btn btn-secondary'>
                      Edit Bio
                    </button>
                  )}                                </>
              )}
            </div>
            <div className='friend-request'>
              {/* Friend request button and content */}
              {!isOwnProfile && !friendRequestSent && (
                <button onClick={handleAddFriend}>Add Friend</button>
              )}

              {!isOwnProfile && friendRequestSent && (
                <button disabled>Request Sent</button>
              )}

              {!isOwnProfile && !friendRequestSent && (
                <button disabled>Already Friend</button>
              )}
            </div>
            <div className='user-posts'>
              <h4>Post</h4>
              <div className="feeds">
                {isOwnProfile && posts.length > 0 ? (
                  posts.map((post) => (
                    <div className="feed" key={post._id}>
                      <div className="head">
                        <div className="user">
                          <div className="profile-photo">
                            <img src={Logo} alt="Profile" />
                          </div>
                          <div className="info">
                            <h3>{post.author}</h3>
                            <small>{post.timestamp}, {post.timeAgo}</small>
                          </div>
                        </div>
                        <span className="edit" onClick={toggleDropdown} onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                          <i className="uil uil-ellipsis-h"></i>
                          {isDropdownOpen && (
                            <div className="dropdown-menu">
                              {isOwnProfile && (<button onClick={() => handleClickDeletePost(post._id)}>Delete Post</button>)}
                              <button onClick={handleReportPost}>Report Post</button>
                            </div>
                          )}
                        </span>
                      </div>
                      <div className="photo">
                        <img src={`data:${post.image.contentType};base64,${btoa(new Uint8Array(post.image.data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`} alt="Post" />
                      </div>

                      {/* <div className="action-buttons">
                <div className="interaction-buttons">
                  <span onClick={() => handleLikeClick(post._id)}>
                    <i className={`uil uil-thumbs-up ${post.isLiked ? 'liked' : ''}`}>
                      {post.likes.length}
                    </i>
                  </span>
                  <span><i className="uil uil-comment" onClick={() => setShowComment(post)}>{post.comments.length}</i></span>
                  <span><i className="uil uil-share">{post.shares}</i></span>
                </div>
                <div className="bookmarks">
                  <span><i className="uil uil-bookmark-full"></i></span>
                </div>
              </div> */}

                      <div className="caption">
                        <p><b>{post.author}</b> {post.caption}</p>
                      </div>

                    </div>
                  ))
                ) : (
                  <p>No posts available.</p>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>


    </>
  );
};

export default Profile;



