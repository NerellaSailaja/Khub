import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import './profile.css';

function ProfileSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminData, setAdminData] = useState({
    name: '',
    mail: '',
    phoneNumber: '',
    registeredDate: '',
    profilePicture: '' // Add profile picture field
  });
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    phoneNumber: '',
    password: '',
    profilePicture: null // Add profile picture field for form data
  });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAdminData = async () => {
      const storedEmail = localStorage.getItem('mail');
      
      if (!storedEmail) {
        navigate('/login');
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/admin/profile/${storedEmail}`
        , { headers: { Authorization: `Bearer ${token}` } });
        
        const profileData = response.data;

        // Save the user's name in localStorage
      localStorage.setItem('name', profileData.name || '');
  
        setAdminData({
          name: profileData.name || '',
          mail: profileData.mail || '',
          phoneNumber: profileData.phoneNumber || '',
          registeredDate: profileData.registeredDate ? 
            new Date(profileData.registeredDate).toLocaleDateString() : '',
          profilePicture: profileData.profilePicture || '' // Ensure this is set correctly
        });
  
        setFormData({
          name: profileData.name || '',
          mail: profileData.mail || '',
          phoneNumber: profileData.phoneNumber || '',
          password: '',
          profilePicture: null
        });
  
      } catch (error) {
        setError('Error loading profile: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
  
    fetchAdminData();
  }, [navigate, token]);
  
  const handleProfilePictureUpload = async (file) => {
    const formData = new FormData();
    formData.append('email', adminData.mail);
    formData.append('profilePicture', file);
  
    try {
      const response = await axios.post(
        'http://localhost:5000/admin/upload-profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` // Add token here
          },
          
        }
      );
  
      // Update the adminData state with the new profile picture filename
      setAdminData(prev => ({
        ...prev,
        profilePicture: response.data.profilePicture
      }));
  
      return response.data.profilePicture;
    } catch (error) {
      throw new Error('Error uploading profile picture: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: e.target.files[0] // Set the selected file
    }));
  };
  const getProfilePictureUrl = (filename) => {
    if (!filename) return "https://via.placeholder.com/150";
    return `http://localhost:5000/admin/profile-picture/${filename}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
  
    try {
      // First update profile details
      const profileData = {
        email: adminData.mail,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        password: formData.password || undefined
      };
  
      await axios.post('http://localhost:5000/admin/profiles/update', profileData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Handle profile picture upload separately if there is one
      if (formData.profilePicture) {
        await handleProfilePictureUpload(formData.profilePicture);
      }
  
      // Refresh admin data
      const response = await axios.get(`http://localhost:5000/admin/profile/${adminData.mail}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminData(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      setError('Error updating profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };
  

  if (loading) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: 'center', width: '100%', padding: '20px' }}>
          <Loader2 className="animate-spin" style={{ margin: 'auto', width: '32px', height: '32px' }} />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  const ProfileImage = React.memo(({ src, alt }) => {
    const [imgSrc, setImgSrc] = useState(src);
    
    return (
      <img 
        src={imgSrc}
        alt={alt}
        className="profile-picture"
        onError={() => setImgSrc("https://via.placeholder.com/150")}
      />
    );
  });
  return (
    <div className="profile-container" id="mainProfile">
      {/* Profile Sidebar */}
      <div className="profile-sidebar">
      <ProfileImage 
    src={adminData.profilePicture ? 
      `http://localhost:5000/admin/profile-picture/${adminData.profilePicture}` :
      "https://via.placeholder.com/150"
    }
    alt="Profile"
  />

        <h3>{adminData.name}</h3>
        <p>{adminData.mail}</p>
        <p>Registered on: {adminData.registeredDate}</p>
        <button 
          className="update-button"
          onClick={() => alert('Update Profile Image clicked')}
          disabled={saving}
        >
          Update Profile Image
        </button>
      </div>

      {/* Profile Details */}
      <div className="profile-details">
        <h2>Admin Profile</h2>
        {error && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '10px', 
            backgroundColor: '#ffe6e6', 
            color: '#ff0000',
            borderRadius: '5px' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Full Name"
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="mail"
              value={formData.mail}
              className="form-input"
              placeholder="Email"
              disabled
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Phone Number"
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="New Password (leave blank to keep current)"
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="form-input"
              accept="image/*"
              disabled={saving}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setFormData(adminData)}
              className="update-button"
              disabled={saving}
              style={{ backgroundColor: '#6c757d' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="update-button"
              disabled={saving}
            >
              {saving ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <Loader2 className="animate-spin" style={{ width: '16px', height: '16px' }} />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;
