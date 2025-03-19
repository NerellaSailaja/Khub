import React, { useState } from 'react';
import axios from 'axios';
import './add-college.css';

const AddCollege = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationCode: '',
    organizationMail: '',
    websiteHandlerName: '',
    websiteHandlerMail: '',
    websiteHandlerPhoneNumber: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/college-admin/register', formData);
      alert('Registration successful!');
      // Reset the form or redirect to login page
    } catch (error) {
      alert(`Registration failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="ac-container">
      <h2 className="ac-title">College Admin Registration</h2>
      <form className="ac-form" onSubmit={handleSubmit}>
        <div className="ac-form-group">
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            className="ac-input"
            placeholder="Organization Name"
            value={formData.organizationName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="ac-form-group">
          <input
            type="text"
            id="organizationCode"
            name="organizationCode"
            className="ac-input"
            placeholder="Organization Code"
            value={formData.organizationCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="ac-form-group">
          <input
            type="email"
            id="organizationMail"
            name="organizationMail"
            className="ac-input"
            placeholder="Organization Email"
            value={formData.organizationMail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="ac-form-group">
          <input
            type="text"
            id="websiteHandlerName"
            name="websiteHandlerName"
            className="ac-input"
            placeholder="Website Handler Name"
            value={formData.websiteHandlerName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="ac-form-group">
          <input
            type="email"
            id="websiteHandlerMail"
            name="websiteHandlerMail"
            className="ac-input"
            placeholder="Website Handler Email"
            value={formData.websiteHandlerMail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="ac-form-group">
          <input
            type="tel"
            id="websiteHandlerPhoneNumber"
            name="websiteHandlerPhoneNumber"
            className="ac-input"
            placeholder="Website Handler Phone Number"
            value={formData.websiteHandlerPhoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="ac-form-group">
          <input
            type="password"
            id="password"
            name="password"
            className="ac-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="ac-button">Register</button>
      </form>
    </div>
  );
};

export default AddCollege;
