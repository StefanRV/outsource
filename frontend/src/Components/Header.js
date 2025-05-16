import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ThemeToggle from "./ThemeToggle";
import LoginModal from "./LoginForm";
import RegisterModal from "./RegisterForm";
import { FaCreditCard } from "react-icons/fa";

const Header = ({ user, onLogin, onLogout }) => {
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const navigate = useNavigate();

  const fetchBalance = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: { "x-access-token": token },
        }
      );

      const data = response.data;
      setUserRole(data.role);
      setUserBalance(data.balance);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to fetch balance");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  const handleThemeChange = (isDark) => {
    setIsDarkTheme(isDark);
  };

  const logoPath = isDarkTheme ? "/Images/Dark_Logo.png" : "/Images/Logo.png";

  return (
    <>
      <style>
        {`
          .custom-navbar-toggle .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
          }
          .custom-navbar-toggle {
            border-color: #FFFFFF;
          }
        `}
      </style>
      <div>
        <Navbar
          style={{
            backgroundColor: isDarkTheme ? "#1E1E1E" : "#FFFFFF",
            borderBottom: `1px solid ${isDarkTheme ? "#4A4A4A" : "#E3E3E3"}`,
          }}
          expand="lg"
          className="py-3 mb-4"
        >
          <Container style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Navbar.Brand as={Link} to="/">
              <img src={logoPath} alt="Logo" style={{ height: "50px" }} />
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="custom-navbar-toggle"
            />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto d-flex align-items-center justify-content-end">
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`me-2 ${isDarkTheme ? "text-white" : "text-dark"}`}
                >
                  Products
                </Nav.Link>
                {userRole === "user" ? (
                  <Nav.Link
                    as={Link}
                    to="/orders"
                    className={`me-2 ${
                      isDarkTheme ? "text-white" : "text-dark"
                    }`}
                  >
                    Purchases
                  </Nav.Link>
                ) : userRole === "admin" ? (
                  <Nav.Link
                    as={Link}
                    to="/admin/orders"
                    className={`me-2 ${
                      isDarkTheme ? "text-white" : "text-dark"
                    }`}
                  >
                    Purchases
                  </Nav.Link>
                ) : null}
                <Nav.Link
                  as={Link}
                  to="/forum"
                  className={`me-2 ${isDarkTheme ? "text-white" : "text-dark"}`}
                >
                  Forum
                </Nav.Link>
                {user && (
                  <Nav.Link
                    as={Link}
                    to="/messages"
                    className={`me-2 ${
                      isDarkTheme ? "text-white" : "text-dark"
                    }`}
                  >
                    Messages
                  </Nav.Link>
                )}
                {userRole === "admin" && (
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className={`me-2 ${
                      isDarkTheme ? "text-white" : "text-dark"
                    }`}
                  >
                    Dashboard
                  </Nav.Link>
                )}
                <Nav.Link
                  as={Link}
                  to="/contacts"
                  className={`me-2 ${isDarkTheme ? "text-white" : "text-dark"}`}
                >
                  Contact
                </Nav.Link>
                {user && (
                  <Nav.Link
                    as={Link}
                    to="/balance"
                    className={`me-2 ${
                      isDarkTheme ? "text-white" : "text-dark"
                    }`}
                  >
                    <FaCreditCard
                      icon="fa-regular fa-credit-card"
                      color={isDarkTheme ? "white" : "black"}
                    />
                    {loading ? "..." : `${userBalance ?? 0}€`}
                  </Nav.Link>
                )}
                <ThemeToggle onThemeChange={handleThemeChange} />
                {user ? (
                  <>
                    <Button
                      variant={isDarkTheme ? "outline-light" : "outline-dark"}
                      className="m-2"
                      as={Link}
                      to="/profile"
                    >
                      Profile
                    </Button>
                    <Button
                      variant={isDarkTheme ? "light" : "dark"}
                      onClick={onLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={isDarkTheme ? "outline-light" : "outline-dark"}
                      className="ms-2"
                      onClick={() => setShowLogin(true)}
                    >
                      Sign in
                    </Button>
                    <Button
                      variant={isDarkTheme ? "light" : "dark"}
                      className="ms-2"
                      onClick={() => setShowRegister(true)}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <LoginModal
        show={showLogin}
        handleClose={() => setShowLogin(false)}
        onLogin={onLogin}
      />
      <RegisterModal
        show={showRegister}
        handleClose={() => setShowRegister(false)}
        onLogin={onLogin}
      />
    </>
  );
};

export default Header;
