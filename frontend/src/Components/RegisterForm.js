import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function RegisterModal({ show, handleClose, onLogin }) {
  const [step, setStep] = useState(1); 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, passwords: password, confirmPassword }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }

      setInfo(data.message);
      setStep(2); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
  
    if (!code) {
      setError("Please enter the verification code.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }), 
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }
  
      localStorage.setItem("token", data.accessToken);
      onLogin(data);
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {info && <Alert variant="info">{info}</Alert>}

        {step === 1 && (
          <Form onSubmit={handleInitialSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send Verification Code
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form onSubmit={handleCodeSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the code sent to your email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Confirm & Register
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
