import React, { useState } from 'react';
import axios from 'axios';
import './add-admin.css'; // Assuming the CSS is saved as add-admin.css

function AddAdmin() {
    const [adminDetails, setAdminDetails] = useState({
        name: '',
        mail: '',
        password: '',
        phoneNumber: ''
    });
    const [message, setMessage] = useState('');

    const handleAddAdmin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/admin/add-admin', adminDetails);
            setMessage(response.data.message);
            setAdminDetails({ name: '', mail: '', password: '', phoneNumber: '' });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add admin');
        }
    };

    return (
        <div className="admin-container">
            <h3 className="admin-title">Welcome to the Admin Page</h3>
            <h3 className="admin-subtitle">Add New Admin</h3>
            {message && <p className="admin-message">{message}</p>}

            <div className="admin-form">
                <input
                    type="text"
                    className="admin-input"
                    placeholder="Name"
                    value={adminDetails.name}
                    onChange={(e) => setAdminDetails({ ...adminDetails, name: e.target.value })}
                />
                <input
                    type="email"
                    className="admin-input"
                    placeholder="Email"
                    value={adminDetails.mail}
                    onChange={(e) => setAdminDetails({ ...adminDetails, mail: e.target.value })}
                />
                <input
                    type="password"
                    className="admin-input"
                    placeholder="Password"
                    value={adminDetails.password}
                    onChange={(e) => setAdminDetails({ ...adminDetails, password: e.target.value })}
                />
                <input
                    type="text"
                    className="admin-input"
                    placeholder="Phone Number"
                    value={adminDetails.phoneNumber}
                    onChange={(e) => setAdminDetails({ ...adminDetails, phoneNumber: e.target.value })}
                />
                <button className="admin-button" onClick={handleAddAdmin}>Add Admin</button>
            </div>
        </div>
    );
}

export default AddAdmin;