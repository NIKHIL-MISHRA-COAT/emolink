// import React, { useState, useEffect } from 'react';
// import { BsArrowLeft } from 'react-icons/bs';
// import './Chatbox.css';
// import axios from 'axios';
// import io from "socket.io-client";

// const Endpoint = 'http://localhost:5000';

// const ChatBox = ({ user, onClose }) => {
//   const [chatMessages, setChatMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [socket, setSocket] = useState(null); // State to hold the socket instance



//   useEffect(() => {


//     // Fetch chat messages
//     const fetchChatMessages = async () => {
//       try {
//         const token = localStorage.getItem('tokenurl');
//         const config = {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const chatResponse = await axios.post(
//           'http://localhost:5000/chat/',
//           {
//             userId: user._id,
//           },
//           config
//         );
//         const response = await axios.get(`http://localhost:5000/message/${chatResponse.data._id}`, config);
//         setChatMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching chat messages:', error);
//       }
//     };

//     if (user) {
//       fetchChatMessages();
//     }

//     // Socket.io event listener for incoming messages
//     // socket.on('message', (message) => {
//     //   setChatMessages((prevChatMessages) => [...prevChatMessages, message]);
//     // });


//   }, [user]);

//   const handleSendMessage = async () => {
//     try {
//       // if (socket) {
//       // Send new message
//       const token = localStorage.getItem('tokenurl');
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const chatResponse = await axios.post(
//         'http://localhost:5000/chat',
//         {
//           userId: user._id,
//         },
//         config
//       );

//       const messageResponse = await axios.post(
//         'http://localhost:5000/message',
//         {
//           content: newMessage,
//           chatId: chatResponse.data._id,
//         },
//         config
//       );

//       // Emit the message to the server
//       // socket.emit('message', messageResponse.data);

//       setNewMessage('');
//       setChatMessages((prevChatMessages) => [...prevChatMessages, messageResponse.data]);
//       // }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const typingHandler = (e) => {
//     setNewMessage(e.target.value);
//   };

//   return (
//     <div className="chat-box">
//       <button className="btn btn-back" onClick={onClose}>
//         <BsArrowLeft size={20} />
//       </button>
//       <span className="chat-header">Chat with {user.username}</span>
//       <br />
//       <br />

//       {chatMessages && (
//         <div className="chat-messages">
//           {chatMessages.map((msg, index) => (
//             <div key={index} className={msg.sender._id === 'You' ? 'sent' : 'received'}>
//               <strong>{msg.sender.name}:</strong> {msg.content}
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={newMessage}
//           onChange={typingHandler}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               e.preventDefault();
//               handleSendMessage();
//             }
//           }}
//         />

//         <button className="btn btn-send btn-primary" onClick={handleSendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;


import React, { useState, useEffect ,useRef} from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import './Chatbox.css';
import axios from 'axios';

const ChatBox = ({ user, onClose }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  // const chatBoxRef = useRef(null);

  useEffect(() => {
    // Fetch chat messages
    const fetchChatMessages = async () => {
      try {
        const token = localStorage.getItem('tokenurl');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const chatResponse = await axios.post(
          'http://localhost:5000/chat/',
          {
            userId: user._id,
          },
          config
        );
        const response = await axios.get(`http://localhost:5000/message/${chatResponse.data._id}`, config);
        setChatMessages(response.data);

        // chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    if (user) {
      fetchChatMessages();
    }

    // Set up interval for auto-refresh
    const refreshInterval = setInterval(() => {
      fetchChatMessages();
    }, 200);

    // Cleanup interval on component unmount or if the user changes
    return () => clearInterval(refreshInterval);


  }, [user]);

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('tokenurl');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const chatResponse = await axios.post(
        'http://localhost:5000/chat',
        {
          userId: user._id,
        },
        config
      );

      const messageResponse = await axios.post(
        'http://localhost:5000/message',
        {
          content: newMessage,
          chatId: chatResponse.data._id,
        },
        config
      );

      setNewMessage('');
      setChatMessages((prevChatMessages) => [...prevChatMessages, messageResponse.data]);
      console.log(chatMessages)
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
  
  return (
    <div className='chat-p'>
     <div className="chat-box" > {/* ref={chatBoxRef} */}
      <div className='header'>
      <button className="btn btn-back" onClick={onClose}>
        <BsArrowLeft size={16} />
      </button>
      <span className="chat-header">&nbsp;&nbsp;{user.username}</span>
      </div>
      
      <div className='msg'>
      {chatMessages && (
        <div className="chat-messages">
          {chatMessages.map((msg, index) => ( 
            <div key={index} className="chitchat">
              <strong>{msg.sender.name}: &nbsp;</strong> 
              <div className='m'>
              {msg.content}
              </div>
            </div>
          ))}
        </div>
      )} 
      
         </div>
      <div className="chat-input">
        <input
          type="text"
          className=''
          placeholder="Type your message..."
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <button className="btn btn-send btn-primary" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
    </div>
  );
};

export default ChatBox;
