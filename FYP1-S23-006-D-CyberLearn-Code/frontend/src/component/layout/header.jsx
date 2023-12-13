import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Swal from "sweetalert2";

const HeaderFour = () => {
  const [headerFiexd, setHeaderFiexd] = useState(false);
  const isLoggedIn = localStorage.getItem("token");
  const [username, setUsername] = useState(null);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      setHeaderFiexd(true);
    } else {
      setHeaderFiexd(false);
    }
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setUsername(null);

      navigate("/login");
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUsername(username);
  }, [isLoggedIn]);

  const avatarUrl = "../assets/images/author/01.jpg";

  const dropdownStyles = `
  .dropdown-toggle::after {
    display: none;
  }
`;

  return (
    <header
      className={`header-section style-4 ${headerFiexd ? "header-fixed fadeInUp" : ""
        }`}
    >
      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            <div className="logo-search-acte">
              <div className="logo">
                <Link to="/">
                  <img
                    src="http://localhost:3000/assets/images/logo/green.png"
                    alt="logo"
                  />
                </Link>
              </div>
            </div>
            <div className="menu-area">
              {isLoggedIn ? (
                <>
                  <div className="menu">
                    <ul className={`lab-ul`}>
                      <li>
                        <NavLink to="/">Home</NavLink>
                      </li>
                      <li>
                        <NavLink to="/course">All Courses</NavLink>
                      </li>
                      <li>
                        <NavLink to="/my-courses">My Courses</NavLink>
                      </li>
                      <li>
                        <NavLink to="/dashboard">Dashboard</NavLink>
                      </li>
                    </ul>
                  </div>

                  <Link
                    to="/create"
                    className="lab-btn me-3 d-none d-md-block"
                    style={{ backgroundColor: "#26C976" }}
                  >
                    <span>New Course</span>
                  </Link>
                </>
              ) : (
                <div className="menu">
                  <ul className={`lab-ul`}>
                    <li>
                      <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                      <NavLink to="/course">All Courses</NavLink>
                    </li>
                  </ul>
                </div>
              )}

              {isLoggedIn ? (
                <>
                  <style>{dropdownStyles}</style>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={avatarUrl}
                            alt="avatar"
                            className="rounded-circle mr-2"
                            width={32}
                            height={32}
                            style={{ display: "inline-block", marginRight: "5px" }}
                          />
                          <span style={{ display: "inline-block" }}>
                            {username}
                          </span>
                        </div>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/profile">
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="lab-btn me-3 d-none d-md-block"
                    style={{ backgroundColor: "#26C976" }}
                  >
                    <span>Create Account</span>
                  </Link>
                  <Link to="/login" className="d-none d-md-block">
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderFour;
