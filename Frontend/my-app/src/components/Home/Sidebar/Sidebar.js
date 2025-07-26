import React, { useEffect, useState } from "react";
import '../Main/Main.css'
import "./Sidebar.css"
import Logo from "../Images/Logo.png"
import axios from "axios";
import sideFunction from "./SidebarFunction"


const Sidebar = () => {
    const [profName, setProfname] = useState();
    const [notifications, setNotifications] = useState([]);
    const [profPhoto, setProfPhoto] = useState();
    
    useEffect(() => {
        sideFunction();
        const fetchProfName = async () => {
            try {
                const email = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/profDetail?email=${email}`);
                const user = response.data.user.name;
                console.log(response)
                // const nameArray = user.split(' ');
                setProfPhoto(response.data.user.profilePicture)
                // setProfname(nameArray);
                setProfname(user);
            } catch (error) {
                console.log(error);
            }
        }
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

        fetchProfName();
    }, []);
    return (

        <div className="left">
            <a href="/profile" className="profile">
                <div className="profile-photo left-side-profile">
                    {profPhoto ? (
                        <img src={profPhoto} alt="Profile" />
                    ) : (
                        <img src={Logo} alt="Profile" />
                    )}
                </div>
                <div className="handle sidebar-name">
                    <h4>{profName}</h4>
                    <p className="text-muted">@{profName}</p>
                </div>
            </a>
            <div className="sidebar">
                <a href="/home" className="menu-item active">
                    <span><i className="uil uil-home"></i></span><h3>Home</h3>
                </a>
                <a href="/explore" className="menu-item">
                    <span><i className="uil uil-compass"></i></span><h3>Explore</h3>
                </a>
                <a className="menu-item" id="notifications">
                    <span><i className="uil uil-bell"><small className="notification-count">{notifications.length}</small></i></span>
                    <h3>Notifications</h3>
                    <div className="notifications-popup">
                        {notifications.map(notification => (
                            <div key={notification._id} className="notification-item">
                                {/* Render your notification content here */}
                                <div className="profile-photo">
                                    <img src={Logo} alt="Profile" />
                                </div>
                                <div className="notification-body">
                                    <b>{notification.sender.name}</b> {notification.message}
                                    <small className="text-muted">{notification.timestamp}</small>
                                </div>
                            </div>
                        ))}
                    </div>

                </a>
                <a href="#Message-popup" className="menu-item" id="messages-notifications">
                    <span><i className="uil uil-comment-alt-message"><small className="notification-count">6</small></i></span><h3>Messages</h3>
                </a>
                <a href="/bookmark" className="menu-item">
                    <span><i className="uil uil-bookmark"></i></span><h3>Bookmarks</h3>
                </a>
                <a href="/analytics" className="menu-item">
                    <span><i className="uil uil-analytics"></i></span><h3>Analytics</h3>
                </a>
                <a className="menu-item" id="theme">
                    <span><i className="uil uil-palette"></i></span><h3>Theme</h3>
                </a>
                <a href="/settings" className="menu-item">
                    <span><i className="uil uil-cog"></i></span><h3>Settings</h3>
                </a>
            </div>
            {/* <label htmlFor="create-post" className="btn btn-primary">Create Post</label> */}
        </div>

    )
}

export default Sidebar
