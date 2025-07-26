
import React, { useState } from 'react';
import './Setting.css';
import { useNavigate } from 'react-router-dom';
import { forgotPass } from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Home/Navbar/Navbar';
import { updateBio, updateMob, updateName, deactivatedeleteApi} from '../../api'; 
import Swal from 'sweetalert2';

const Settings = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [email, setEmail] = useState('');
    const username = localStorage.getItem('token');

    const handleNameChange = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.error('Name field is required.');
            return;
        }

        try {
            await updateName(username, name);
            toast.success('Name Changed.');
            setName('');
        } catch (error) {
            toast.error(error.response.data);
            console.error(error);
        }
    };

    const handleBioChange = async (e) => {
        e.preventDefault();

        if (!bio) {
            toast.error('Bio field is required.');
            return;
        }

        try {
            await updateBio(username, bio);
            toast.success('Bio Changed.');
            setBio('');
        } catch (error) {
            toast.error(error.response.data);
            console.error(error);
        }

    };

    const handleMobileNoChange = async (e) => {
        e.preventDefault();

        if (!mobileNo) {
            toast.error('Mobile Number field is required.');
            return;
        }

        try {
            await updateMob(username, mobileNo);
            toast.success('Mobile No Changed.');
            setMobileNo('');
        } catch (error) {
            toast.error(error.response.data);
            console.error(error);
        }
    };

    const handleRequestPasswordChange = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Email field is required.');
            return;
        }

        try {
            await forgotPass(email);
            toast.success('Email sent. Please check your inbox to change your password.');
            setEmail('');
        } catch (error) {
            toast.error(error.response.data);
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenurl');
        navigate('/login');
        toast.success('Logged out successfully.');
    };

    const handleDeactivateAccount = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover your account!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, deactivate it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Enter Email and Password',
                    html:
                        `<input id="swal-input1" class="swal2-input" placeholder="Email" type="email">` +
                        `<input id="swal-input2" class="swal2-input" placeholder="Password" type="password">`,
                    focusConfirm: false,
                    preConfirm: () => {
                        const email = Swal.getPopup().querySelector('#swal-input1').value;
                        const password = Swal.getPopup().querySelector('#swal-input2').value;
                        // Perform validation or API call for email and password here
                        return { email: email, password: password };
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Call deactivate account API with email and password
                        deactivateOrDeleteAccount(result.value.email, result.value.password, 'deactivate');
                    }
                });
            }
        });
    };

    const handleDeleteAccount = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover your account!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Enter Email and Password',
                    html:
                        `<input id="swal-input1" class="swal2-input" placeholder="Email" type="email">` +
                        `<input id="swal-input2" class="swal2-input" placeholder="Password" type="password">`,
                    focusConfirm: false,
                    preConfirm: () => {
                        const email = Swal.getPopup().querySelector('#swal-input1').value;
                        const password = Swal.getPopup().querySelector('#swal-input2').value;
                        // Perform validation or API call for email and password here
                        return { email: email, password: password };
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Call delete account API with email and password
                        deactivateOrDeleteAccount(result.value.email, result.value.password, 'delete');
                    }
                });
            }
        });
    };
    const deactivateOrDeleteAccount = async ( email, password,action) => {

      try {
        await deactivatedeleteApi(email,password,action);
        if(action==="delete"){
        toast.success('Account Delete Request Submitted. You have 7 days to recover account by logging in again');
        }else{
          toast.success('Account Deactivated. You can activate your account by logging in again');
        }
         setTimeout(() => {
          handleLogout();
      }, 5000);
    } catch (error) {
        toast.error(error.response.data);
        console.error(error);
    }
  }

    return (
        <>
            <Navbar />
            <div className="settings-container">
                <h2>Account Settings</h2>

                <form onSubmit={handleNameChange}>
                    <div className="change-name">
                        <h3>Change Name</h3>
                        <input
                            type="text"
                            placeholder="Enter new name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary">
                            Save Name
                        </button>
                    </div>
                </form>

                <div className="change-bio">
                    <h3>Change Bio</h3>
                    <textarea
                        placeholder="Enter new bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    ></textarea>
                    <button onClick={handleBioChange} className="btn btn-primary">
                        Save Bio
                    </button>
                </div>

                <div className="change-mobile">
                    <h3>Change Mobile Number</h3>
                    <input
                        type="text"
                        placeholder="Enter new mobile number"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        required
                    />
                    <button onClick={handleMobileNoChange} className="btn btn-primary">
                        Save Mobile Number
                    </button>
                </div>

                <div className="change-password">
                    <h3>Change Password</h3>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button onClick={handleRequestPasswordChange} className="btn btn-primary">
                        Request Password Change
                    </button>
                </div>

                <div className="account-actions">
                    <h3>Account Actions</h3>
                    <button onClick={handleLogout} className="btn btn-primary">
                        Logout
                    </button>
                    <button onClick={handleDeactivateAccount} className="btn btn-danger">
                        Deactivate Account
                    </button>
                    <button onClick={handleDeleteAccount} className="btn btn-danger">
                        Delete Account
                    </button>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Settings;
