import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaHome, FaUniversity, FaPlus, FaUserPlus, FaBell, FaUserCircle } from 'react-icons/fa';
import './Home.css';
import logo from '../images/small.png';
import devLogo from '../images/Logoo.png';
//import { BsWindowSidebar } from "react-icons/bs";

const AdminHomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [name, setName] = useState('');
  const location = useLocation();
  

  //const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const storedName = localStorage.getItem('name') || location.state?.name || 'Admin';
    console.log("Retrieved Name:", storedName);
    setName(storedName);
  }, [location.state]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="main-admin-css-page" id="mainAdminHome">
      {/* Sidebar */}
      <div
        className={`main-admin-css-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        onMouseEnter={() => !isMobile && setSidebarOpen(true)}
        onMouseLeave={() => !isMobile && setSidebarOpen(false)}
      >
         <div className="main-admin-css-logo">
          {sidebarOpen ? (
            <img src={devLogo} alt="DevOrbit Logo" className="main-admin-css-sidebar-logo-open" />
          ) : (
            <img src={logo} alt="DevOrbit Logo" className="main-admin-css-sidebar-logo" />
          )}
        </div>
        
        <nav className="main-admin-css-nav-menu">
          <ul>
            <li>
              <Link to="/adminHome" className="main-admin-css-link">
                <FaHome className="main-admin-css-icon" />
                {sidebarOpen && <span>Home</span>}
              </Link>
            </li>
            <li>
              <Link to="/adminHome/colleges" className="main-admin-css-link">
                <FaUniversity className="main-admin-css-icon" />
                {sidebarOpen && <span>Colleges</span>}
              </Link>
            </li>
            <li>
              <Link to="/adminHome/add-college" className="main-admin-css-link">
                <FaPlus className="main-admin-css-icon" />
                {sidebarOpen && <span>Add College</span>}
              </Link>
            </li>
            <li>
              <Link to="/adminHome/add-admin" className="main-admin-css-link">
                <FaUserPlus className="main-admin-css-icon" />
                {sidebarOpen && <span>Add Admin</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Top Navbar */}
      <header className="main-admin-css-navbar" style={{ marginLeft: sidebarOpen ? '250px' : '65px' }}>
        <div className="main-admin-css-navbar-content">
         
          <h1 className='main-admin-css-welcome-text'>Welcome, {name} 😀</h1>

          <div className="main-admin-css-navbar-icons">
            <Link to="/adminHome/notifications" className="main-admin-css-icon-link" title="Notifications">
              <FaBell className="main-admin-css-icon" />
            </Link>
            <Link to="/adminHome/mainProfile" className="main-admin-css-icon-link" title="Profile">
              <FaUserCircle className="main-admin-css-icon" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-admin-css-content" style={{ marginLeft: sidebarOpen ? '250px' : '65px' }}>
        <div className="main-admin-css-home">
          <div className="main-admin-css-welcome-section">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;