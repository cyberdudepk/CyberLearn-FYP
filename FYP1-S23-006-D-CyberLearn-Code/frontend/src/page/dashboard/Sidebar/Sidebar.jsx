import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ onMenuItemClick, activeComponent }) => {
  const menuItems = [
    { name: "Academy Overview", componentKey: "component1" },
    { name: "Enrolled Courses", componentKey: "component2" },

  ];

  const username = localStorage.getItem("username");

  return (
    <div className="academy-sidebar">
      <div className="academy-sidebar-logo">
        <Link to="/">
          <img
            src="http://localhost:3000/assets/images/logo/green.png"
            alt="Website Logo"
            className="academy-website-logo"
          />
        </Link>
      </div>

      <div className="academy-sidebar-header">
        <img
          src="../assets/images/author/01.jpg"
          alt="User Avatar"
          className="academy-user-avatar"
        />
        <div className="academy-user-name">Hello {username}!</div>
      </div>
      {menuItems.map((item) => (
        <div
          key={item.componentKey}
          className={`academy-menu-item ${
            activeComponent === item.componentKey ? "academy-active" : ""
          }`}
          onClick={() => onMenuItemClick(item.componentKey)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
