import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";

const BalancePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePayment = async (amount) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formattedAmount = parseFloat(amount.toFixed(2));

      const response = await axios.post(
        "http://localhost:5000/api/users/recharge",
        { amount: formattedAmount  },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
        }
      );
      window.location.reload();
      
    } catch (err) {
      setError(err.response?.data?.message || "Error during balance addition"+err.message);
    } finally {
      setLoading(false);
      // setSuccess(`Balance is successfully added by ${amount}€`);
    }
  };
  
  return (
    <Container>
      <Row className="mt-4">
        <Col md={12}>
          <h2>Add balance</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <div className="mt-4">
            <h4>Choose sum:</h4>
            <div className="d-flex flex-wrap">
              {[5.0, 10, 15, 20, 30, 50].map((amount) => (
                <Button
                  key={amount}
                  variant="primary"
                  className="m-2"
                  onClick={() => handlePayment(parseFloat(amount))}
                  disabled={loading}
                >
                  {amount}€
                </Button>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BalancePage;
