import React, { useState, useEffect } from 'react';
import './Navbar.css';
import Logo from '../Images/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Icon from '../Images/icon.png';
import axios from 'axios'; // Import Axios for API calls

const Navbar = () => {
  const LogOuthowAlertSuccess = () => {
    Swal.fire({
      title: 'LogOut Success',
      text: 'Please Log in Again',
      icon: 'success',
    });
  };

  const [isProfileActive, setProfileActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const username = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsernames = async () => {
      try {
        const token = localStorage.getItem('tokenurl');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5000/username', config);
        setSearchSuggestions(response.data.map(user => user.username));
      } catch (error) {
        console.error('Error fetching all usernames:', error);
      }
    };

    fetchAllUsernames();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    LogOuthowAlertSuccess();
  };

  const handleSearch = () => {
    // Redirect to the profile page with the specified email ID
    navigate(`/profile/${searchQuery}`);
  };

  return (
    <nav>
      <div className='container'>
        <div className='icon'>
          <Link to="/home">
            <img src={Icon} alt='ProfilePic' className='nav-conatiner-icon-image' />
          </Link>
        </div>
        <div className='Searchbar'>
          <input
            className="search-input"
            type='text'
            placeholder='Search by Email'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          {/* Display search suggestions */}
          {searchQuery.length > 0 && (
          <ul className={`search-suggestions ${searchSuggestions.length > 0 ? 'show' : ''}`}>
            {searchSuggestions
              .filter(username => username.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(suggestion => (
                <li key={suggestion} onClick={() => setSearchQuery(suggestion)}>
                  {suggestion}
                </li>
              ))}
          </ul>
          )}
          <button className='btn btn-search' onClick={handleSearch}>
            <i className='uil uil-search'></i>
          </button>
        </div>

        <div className='create right-profile-nav'>
          <div
            className='profile-photo'
            onMouseEnter={() => setProfileActive(true)}
            onMouseLeave={() => setProfileActive(true)}
          >
            <img src={Logo} alt='ProfilePic' />
            {isProfileActive && (
              <div className='profile-options'>
                <span className='username'>{username}</span>
                <button className='btn btn-logout' onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
