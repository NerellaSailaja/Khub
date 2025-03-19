import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Main-content.css';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedMessageDetails, setSelectedMessageDetails] = useState(null); // For viewing a full message

  // Fetch messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contact');
        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, []);

  // Handle selecting/deselecting messages
  const handleSelectMessage = (id) => {
    if (selectedMessages.includes(id)) {
      setSelectedMessages(selectedMessages.filter((messageId) => messageId !== id));
    } else {
      setSelectedMessages([...selectedMessages, id]);
    }
  };

  // Handle delete selected messages
  const handleDeleteSelected = async () => {
    try {
      if (selectedMessages.length > 0) {
        await axios.delete('http://localhost:5000/contact', { data: { ids: selectedMessages } });
        setMessages(messages.filter((msg) => !selectedMessages.includes(msg._id)));
        setSelectedMessages([]);
      } else {
        alert('Please select at least one message to delete.');
      }
    } catch (error) {
      console.error('Error deleting selected messages:', error);
    }
  };

  // Handle viewing a message (display it in a modal)
  const handleViewMessage = (message) => {
    setSelectedMessageDetails(message);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedMessageDetails(null);
  };

  return (
    <div className="admin-dashboard" id='adminDashboard'>
      <h2>Contact Messages from the Last Month</h2>

      {/* Button to delete selected messages */}
      <button onClick={handleDeleteSelected} className="delete-selected-btn">
        Delete Selected
      </button>

      {/* Display all messages */}
      <div className="messages-list">
        {messages.length === 0 ? (
          <p>No messages found from the last month.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="message-box">
              <div className="message-checkbox">
                <input
                  type="checkbox"
                  checked={selectedMessages.includes(msg._id)}
                  onChange={() => handleSelectMessage(msg._id)}
                />
              </div>
              <div className="message-content" onClick={() => handleViewMessage(msg)}>
                <div className="message-name">{msg.name}</div>
                <div className="message-body">{msg.message.slice(0, 100)}...</div> {/* Show first 100 chars */}
                <div className="message-footer">
                  <span className="message-date">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for viewing full message */}
      {selectedMessageDetails && (
        <div className="message-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>X</span>
            <h3>Message from: {selectedMessageDetails.name}</h3>
            <p><strong>Email:</strong> {selectedMessageDetails.email}</p>
            <p><strong>Message:</strong> {selectedMessageDetails.message}</p>
            <p><strong>Date:</strong> {new Date(selectedMessageDetails.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
