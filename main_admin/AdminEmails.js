import React, { useEffect, useState } from 'react';

const AdminEmails = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/emails');
        const data = await response.json();
        setEmails(data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div>
      <h2>Contact Form Submissions</h2>
      <ul>
        {emails.map((email) => (
          <li key={email._id}>
            <strong>{email.name}</strong> ({email.email}) - {email.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminEmails;
