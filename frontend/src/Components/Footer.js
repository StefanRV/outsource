import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkTheme(savedTheme === "dark");

    const handleStorageChange = () => {
      const newTheme = localStorage.getItem("theme");
      setIsDarkTheme(newTheme === "dark");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logoPath = isDarkTheme ? "/Images/Dark_Logo.png" : "/Images/Logo.png";

  return (
    <>
      <div
        style={{
          borderBottom: `1px solid ${isDarkTheme ? "#4A4A4A" : "#E3E3E3"}`,
        }}
      />
      <footer>
        {/* Верхняя часть футера */}
        <div
          style={{
            backgroundColor: isDarkTheme ? "#1E1E1E" : "#FFFFFF",
            padding: "20px 0",
          }}
        >
          <Container>
            <Row className="align-items-center">
              <Col md={4} className="text-start">
                <ul className="list-unstyled d-flex justify-content-start mb-0">
                  <li className="me-3">
                    <Link
                      to="/"
                      className={
                        isDarkTheme
                          ? "text-white text-decoration-none"
                          : "text-dark text-decoration-none"
                      }
                    >
                      Home
                    </Link>
                  </li>
                  <li className="me-3">
                    <Link
                      to="/forum"
                      className={
                        isDarkTheme
                          ? "text-white text-decoration-none"
                          : "text-dark text-decoration-none"
                      }
                    >
                      Forum
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contacts"
                      className={
                        isDarkTheme
                          ? "text-white text-decoration-none"
                          : "text-dark text-decoration-none"
                      }
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </Col>
              <Col md={4} className="text-center">
                <img src={logoPath} alt="Logo" style={{ height: "40px" }} />
              </Col>
              <Col md={4} className="text-end">
                <Link
                  to="/privacy"
                  className={
                    isDarkTheme
                      ? "text-white text-decoration-none"
                      : "text-dark text-decoration-none"
                  }
                >
                  Terms of Service and Privacy Policy.
                </Link>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Нижняя тёмная полоса */}
        <div style={{ backgroundColor: "#1E1E1E", padding: "10px 0" }}>
          <Container>
            <Row>
              <Col className="text-center">
                <p className="text-white mb-0">
                  © 2025 OutLands. All rights reserved.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </footer>
    </>
  );
};

export default Footer;
