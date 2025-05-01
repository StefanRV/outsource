import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import ThemeToggle from './ThemeToggle';
import LoginModal from "./LoginForm";
import RegisterModal from "./RegisterForm";
import { FaCreditCard} from "react-icons/fa";

const Header = ({ user, onLogin, onLogout }) => {
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
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

      const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { "x-access-token": token },
      });

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

      // const interval = setInterval(() => {
      //   fetchBalance();
      // }, 500); 

      // return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <>
      <div>
        <Navbar bg="light" expand="lg" className="head mb-4">
          <Container>
            <Navbar.Brand as={Link} to="/">LOGO</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto d-flex align-items-center">
                <Nav.Link as={Link} to="/">Products</Nav.Link>
                {userRole === 'user' ? (
                  <Nav.Link as={Link} to="/orders">Purchases</Nav.Link>
                ) : userRole === 'admin' ? (
                  <Nav.Link as={Link} to="/admin/orders">Purchases</Nav.Link>
                  
                ) : null}
                <Nav.Link as={Link} to="/forum">Forum</Nav.Link>
                {user && (
                  <Nav.Link as={Link} to="/messages">Messages</Nav.Link>
                )}
                {userRole ==='admin' && (
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                )}
                <Nav.Link as={Link} to="/contacts">Contact</Nav.Link>
                {user && (
                  <Nav.Link as={Link} to="/balance">
                  
                  <FaCreditCard icon="fa-regular fa-credit-card" color="black" />{loading ? "..." : `${userBalance ?? 0}€`}
                  </Nav.Link>
                )}
                <ThemeToggle />
                {user ? (
                  <>
                    <Button variant="outline-dark" className="mx-2" as={Link} to="/profile">Profile</Button>
                    <Button variant="dark" onClick={onLogout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline-dark" className="mx-2" onClick={() => setShowLogin(true)}>Sign in</Button>
                    <Button variant="dark" onClick={() => setShowRegister(true)}>Register</Button>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} onLogin={onLogin} />
      <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} onLogin={onLogin} />
    </>
  );
};

export default Header;
