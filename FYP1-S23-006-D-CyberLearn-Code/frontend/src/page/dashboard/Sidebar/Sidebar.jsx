import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ onMenuItemClick, activeComponent }) => {
  const menuItems = [
    { name: "Academy Overview", componentKey: "component1" },
    { name: "Enrolled Courses", componentKey: "component2" },
    { name: "Component 3", componentKey: "component3" },
    { name: "Component 4", componentKey: "component4" },
    { name: "Component 5", componentKey: "component4" },

  ];

  const username = localStorage.getItem("username");

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Link to="/">
          <img
            src="http://localhost:3000/assets/images/logo/green.png"
            alt="Website Logo"
            className="website-logo"
          />
        </Link>
      </div>

      <div className="sidebar-header">
        <img
          src="../assets/images/author/01.jpg"
          alt="User Avatar"
          className="user-avatar"
        />
        <div className="user-name">Hello {username}!</div>
      </div>
      {menuItems.map((item) => (
        <div
          key={item.componentKey}
          className={`menu-item ${
            activeComponent === item.componentKey ? "active" : ""
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
