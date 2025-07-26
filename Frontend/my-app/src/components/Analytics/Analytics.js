import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsPeopleFill, BsFillTrophyFill, BsFillBellFill } from 'react-icons/bs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import Header from '../Home/Navbar/Navbar.js';
import { fetchUserActivityDuration } from '../../api/index.js';
import './Analytics.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const formatDuration = (value) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  let formattedDuration = '';
  if (hours > 0) {
    formattedDuration += `${hours} hours `;
  }
  if (minutes > 0) {
    formattedDuration += `${minutes} minutes `;
  }
  formattedDuration += `${seconds} seconds`;

  return formattedDuration.trim();
};

const Analytics = () => {
  const [userActivityDuration, setUserActivityDuration] = useState([]);
  const [points, setPoints] = useState();
  const [redeemPoints, setRedeemPoints] = useState(5);

  useEffect(() => {
    const email = localStorage.getItem('token');
    const username = email; // Replace with actual username
    const fetchUserActivityData = async () => {
      try {
        const activityDuration = await fetchUserActivityDuration(username);
        setUserActivityDuration(activityDuration);
      } catch (error) {
        console.error('Error fetching user activity duration:', error);
      }
    };
    const fetchPoints = async () => {
      try {
        const token = localStorage.getItem('tokenurl');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5000/getpoints', config);
        setPoints(response.data);

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchPoints();
    fetchUserActivityData();
  }, []);
  const handleRedeem = () => {
    const token = localStorage.getItem('tokenurl');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios.post('http://localhost:5000/redeemPoints', { redeemPoints }, config)
      .then(response => {
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Redemption Successful',
          text: response.data.message,
        });
      })
      .catch(error => {
        console.error('Error redeeming points:', error);
        Swal.fire({
          icon: 'warning',
          title: 'Redemption Unsuccessful',
          text: error.response.data.message,
        });
      });
  };

  return (
    <div>
      <Header className='header' />
      <div className='container'>
        <div className='analytics-grid-container'>
          <main className='analytics-main-container'>
            <div className='main-cards'>
              <div className='cards'>
                <div className='card-inner'>
                  <h3>Reputation Points</h3>
                  <BsFillArchiveFill className='card_icon' />
                </div>
                <h1>{points ? points.userPoints.reputation : "Available soon"}</h1>
              </div>
              <div className='cards'>
                <div className='card-inner'>
                  <h3>EmoPoints</h3>
                  <BsFillTrophyFill className='card_icon' />
                </div>
                <h1>{points ? points.userPoints.emopoints : "Available soon"}</h1>
                <div className="emopoints-container">
                  <input
                    className="emopoints-input"
                    type="number"
                    min={points && points.userPoints.emopoints >= 5 ? 5 : 0}
                    max={points ? points.userPoints.emopoints : 0}
                    step={5}
                    value={redeemPoints}
                    onChange={(e) => setRedeemPoints(parseInt(e.target.value))}
                  />
                  <button className="emopoints-button" onClick={handleRedeem}>Redeem</button>
                </div>
              </div>

              <div className='cards'>
                <div className='card-inner'>
                  <h3>No. of Friend Requests</h3>
                  <BsPeopleFill className='card_icon' />
                </div>
                <h1>{points ? points.followersCount : "0"}</h1>
              </div>
              <div className='cards'>
                <div className='card-inner'>
                  <h3>Notification</h3>
                  <BsFillBellFill className='card_icon' />
                </div>
                <h1>{points ? points.notificationsCount : "0"}</h1>
              </div>
            </div>

            <div className='charts'>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={400}
                  height={400}
                  data={userActivityDuration}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="activityTimestamp" />
                  <YAxis dataKey="durationInSeconds" />
                  <Tooltip
                    formatter={(value) => formatDuration(value)}
                  />
                  <Legend />
                  <Bar dataKey="durationInSeconds" fill="rgb(155, 208, 7)" />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={userActivityDuration}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="10 10" />
                  <XAxis dataKey="activityTimestamp" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatDuration(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="durationInSeconds"
                    stroke="rgb(155, 208, 7)"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
