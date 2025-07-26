
import React, { useEffect, useState } from "react";
import './Main.css';
import { addPostApi, acceptFriendRequest, declineFriendRequest } from "../../../api/index.js";
import Logo from "../Images/Logo.png";
import Feeds from "./Feeds/feeds.js";
import Swal from "sweetalert2";
import myFunction from "./Function.js";
import ChatBox from "./Chat/ChatBox.js";
import axios from "axios";
import Story from "./Story/Story.js";
import Preloader from "../Preloader/preloader.js"
import CreateStory from "./Story/CreateStory.js";
import { BsPlusCircle } from 'react-icons/bs';
import { BsImages } from "react-icons/bs";
import Sidebar from "../Sidebar/Sidebar.js";
import Navbar from "../Navbar/Navbar.js";
import { Theme } from "./Theme/Theme.js";
import BackButton from "../../Back.js";
const Main = () => {
    const [u , setU] =useState([])
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [formData, setData] = useState({
        caption: '',
        image: null,
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedStoryUser, setSelectedStoryUser] = useState(null);
    const [showStories, setShowStories] = useState(false);
    const [isCreateStory, setCreate] = useState(false);
    const [storiesData, setStoriesData] = useState([]);



    useEffect(() => {
        myFunction();
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('tokenurl');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };
    
                const [profResponse, usersResponse, friendRequestsResponse, storiesResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/profDetail?email=${localStorage.getItem('token')}`, config),
                    axios.get('http://localhost:5000/username', config),
                    axios.get('http://localhost:5000/friendRequests/friend-requests', config),
                    axios.get('http://localhost:5000/addStory', config),
                ]);
    
                setU(profResponse.data.user);
                setUsers(usersResponse.data);
                setFriendRequests(friendRequestsResponse.data);
    
                const groupedStories = storiesResponse.data.stories.reduce((acc, story) => {
                    const username = story.userId.username;
                    const profilePicture = story.userId.profilePicture;
                    if (!acc[username]) {
                        acc[username] = { stories: [], profilePicture };
                    }
                    acc[username].stories.push(story);
                    return acc;
                }, {});
    
                const mergedStories = Object.entries(groupedStories).map(([username, { stories, profilePicture }]) => {
                    const mergedImages = stories.map(story => ({
                        filename: story.filename,
                        mimetype: story.mimetype,
                        path: story.path
                    }));
                    return {
                        username,
                        profilePicture,
                        images: mergedImages
                    };
                });
    
                setStoriesData(mergedStories);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
    
    const handleInputChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('caption', formData.caption);
            data.append('image', formData.image);

            await addPostApi(data);
            postShowAlertSuccess();
        } catch (error) {
            postShowAlertFail();
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChat = (user) => {
        setSelectedUser(user);
    };

    const handleCloseChat = () => {
        setSelectedUser(null);
    };

    const toggleStories = (user) => {
        setShowStories(!showStories);
        setSelectedUser(user); // Set the selected user
    };


    const toggleCreateStory = () => {
        setCreate(!isCreateStory);
    };



    const postShowAlertSuccess = () => {
        Swal.fire({
            title: 'Post Success',
            text: 'Post Posted',
            icon: 'success',
        });
    };

    const postShowAlertFail = () => {
        Swal.fire({
            title: 'Post Failed',
            text: 'Post not Posted',
            icon: 'error',
        });
    };
    const handleAcceptFriendRequest = async (friendRequestId) => {
        try {
            await acceptFriendRequest(friendRequestId);

            window.location.reload();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleDeclineFriendRequest = async (friendRequestId) => {
        try {
            await declineFriendRequest(friendRequestId);

            window.location.reload();
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    const handleDeleteStory = async (imageToDelete) => {
        try {
            const token = localStorage.getItem('tokenurl');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.delete('http://localhost:5000/deleteStory', {
                headers: config.headers,
                data: { filename: imageToDelete.filename },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    const [notifications, setNotifications] = useState([]);
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('tokenurl');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get('http://localhost:5000/notifications', config);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };
    fetchNotifications();



    return (
        <>
            <Navbar />

            {loading ? (
                <Preloader />
            ) : (
                <>
                    {isCreateStory ? (
                        <CreateStory onClose={() => setCreate(false)} />
                    ) : (
                        <>
                            <main>
                                <div className="container">
                                    <Sidebar />
                                    <div className="home-main">
                                        <div className="center">
                                            <div className="stories">
                                                <div className="story create-face" onClick={toggleCreateStory} >
                                                    <BsPlusCircle size={'7rem'} />
                                                </div>
                                                {storiesData.map((story, index) => (
                                                    <div key={index} className="story" onClick={() => setSelectedStoryUser(story.username)} style={{ backgroundImage: `url(data:${story.images[0].mimetype};base64,${story.images[0].path})` }}>
                                                        {story.profilePicture ? (
                                                            <div className="profile-photo" style={{ backgroundImage: `url(${story.profilePicture})` }}>
                                                                <img src={`${story.profilePicture}`} />
                                                            </div>
                                                        ) : (
                                                            <div className="profile-photo" style={{ backgroundImage: `url(${Logo})` }}>
                                                                <img src={`${Logo}`} />


                                                            </div>
                                                        )}
                                                        <p className="name">{story.username}</p>
                                                    </div>
                                                ))}

                                                {selectedStoryUser && selectedStoryUser !== 'create' && <Story stories={storiesData.filter(story => story.username === selectedStoryUser)} onClose={() => setSelectedStoryUser(null)} onDeleteImage={handleDeleteStory} />}

                                            </div>


                                            <form action="" className="create-post" encType="multipart/form-data">
                                                <div className="profile-photo post-profile">
                                                    <img src={Logo} alt="Post-Pic" />
                                                </div>
                                                <div className="input-post">
                                                    <input type="text" placeholder="What's on your mind?" id="create-post" name="caption" value={formData.caption} onChange={handleInputChange} />


                                                    <div class="wrapper">
                                                        <div class="file-upload">
                                                            <label for="create-post-image" class="buttonpost btn btn-primary"><BsImages />
                                                                <input type="file" accept="image/*" name="image" id="create-post-image" onChange={handleImageChange} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <input type="submit" value="Post" className="writepost btn btn-primary" onClick={handleCreatePost} />


                                                </div>
                                            </form>
                                            <Feeds />
                                        </div>
                                        <div className="right" id="Message-popup">
                                            <div className="messages" >
                                                <div className="heading" id="heading1">
                                                    <h4>Messages</h4><i className="uil uil-message"></i>
                                                </div>
                                                <div className="heading" id="heading2">
                                                    <BackButton />
                                                    &nbsp;&nbsp; <h4>{u.name}</h4>
                                                </div>
                                              
                                                {selectedUser ? (
                                                        <ChatBox user={selectedUser} onClose={handleCloseChat} />
                                                    ) : (<>
                                                <div className="category">
                                                    <h6 className="active" data-category="cat-con-msg">Message</h6>
                                                    <h6 data-category="cat-con-not">Notification</h6>
                                                    <h6 className="message-requests" data-category="cat-con-req">Requests</h6>
                                                </div>
                                                {/* <div className="search-bar">
                                                    <i className="uil uil-search"></i>
                                                    <input type="search" placeholder="search messages" id="message-search" />
                                                </div> */}
                                                <div className="category-content message" id="cat-con-msg">
                                                    
                                                       { users.map(user => (
                                                            <div
                                                                key={user._id}
                                                                className="msg"
                                                                onClick={() => handleOpenChat(user)}
                                                            >
                                                                <div className="profile-photo">
                                                                    {user.profile ? (
                                                                        <img src={user.profile} alt="Profile" />
                                                                    ) : (
                                                                        <img src={Logo} alt="Profile" />
                                                                    )}
                                                                </div>
                                                                <div className="message-body">
                                                                    <h5>{user.username}</h5>
                                                                </div>
                                                            </div>
                                                        ))}
                                                  
                                                </div>
                                                </>  )}
                                                <div className="category-content notification" id="cat-con-not">
                                                    {notifications.map(notification => (
                                                        <div key={notification._id} className="notification-item">
                                                            {/* Render your notification content here */}
                                                            <div className="profile-photo">
                                                                {notification.sender.profilePicture ? (
                                                                    <img src={notification.sender.profilePicture} alt="Profile" />
                                                                ) : (
                                                                    <img src={Logo} alt="Profile" />
                                                                )}
                                                               
                                                            </div>
                                                            <div className="notification-body">
                                                                {/* <b>{notification.sender.name}</b>  */}
                                                                <div> {notification.message} </div>
                                                                <small className="text-muted">{notification.timestamp}</small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="category-content req" id="cat-con-req">
                                                    {/* <div className="friend-requets"> */}
                                                    {friendRequests.map(request => (
                                                        <div key={request._id} className="request">
                                                            <div className="info">
                                                                <div className="profile-photo">
                                                                    {request.sender.profilePicture ? (
                                                                        <img src={request.sender.profilePicture} alt="Profile" />
                                                                    ) : (
                                                                        <img src={Logo} alt="Profile" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h5>{request.sender.username}</h5>
                                                                    <p className="text-muted">
                                                                        {request.sender.username} sent you a friend request
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="action">
                                                                <button className="btn btn-primary" onClick={() => handleAcceptFriendRequest(request._id)}>
                                                                    Accept
                                                                </button>
                                                                <button className="btn" onClick={() => handleDeclineFriendRequest(request._id)}>
                                                                    Decline
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {/* </div> */}
                                                </div>


                                            </div>





                                        </div>
                                    </div>
                                </div>
                            </main>
                        </>
                    )}
                </>)}

            <Theme/>
        </>
    );
};

export default Main;
