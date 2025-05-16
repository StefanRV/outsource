import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";

const BalancePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    month: "",
    year: "",
    cvc: "",
  });
  const [isFlipped, setIsFlipped] = useState(false);

  const validateCardInfo = () => {
    const { number, name, month, year, cvc } = cardInfo;

    const cleanNumber = number.replace(/\D/g, "");

    if (cleanNumber.length !== 16) {
      return "Please enter a valid 16-digit card number.";
    }
    if (!name || name.trim().length < 2) {
      return "Please enter a valid cardholder name.";
    }
    if (!month || parseInt(month) < 1 || parseInt(month) > 12) {
      return "Please enter a valid month (01-12).";
    }
    if (!year || year.length !== 2) {
      return "Please enter a valid year (e.g., 25).";
    }
    const currentYear = new Date().getFullYear() % 100;
    const enteredYear = parseInt(year);
    if (enteredYear < 18 || enteredYear > currentYear) {
      return "Card year must be between 2018 and the current year.";
    }
    if (!cvc || cvc.length !== 3) {
      return "Please enter a valid 3-digit CVC.";
    }

    return null;
  };

  const handlePayment = async () => {
    if (!selectedAmount) {
      setError("Please select an amount.");
      return;
    }

    const cardError = validateCardInfo();
    if (cardError) {
      setError(cardError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formattedAmount = parseFloat(selectedAmount.toFixed(2));

      await axios.post(
        "http://localhost:5000/api/users/recharge",
        { amount: formattedAmount },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(`Balance successfully added: ${formattedAmount}€`);
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error during balance addition: " + err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");
    const truncatedValue = numericValue.slice(0, 16);
    let formattedValue = "";
    for (let i = 0; i < truncatedValue.length; i++) {
      if (i > 0 && i % 4 === 0) formattedValue += "-";
      formattedValue += truncatedValue[i];
    }
    return formattedValue;
  };

  const validateName = (value) => {
    const cleanedValue = value.replace(/[^a-zA-Z\s-]/g, "").toUpperCase();
    const words = cleanedValue.trim().split(/\s+/);
    if (words.length > 2) {
      return words.slice(0, 2).join(" ").trim();
    }
    return cleanedValue.slice(0, 50);
  };

  const validateMonth = (value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 2);
    if (numericValue === "") return "";

    const num = parseInt(numericValue, 10);
    if (numericValue.length === 2) {
      if (num >= 1 && num <= 12) {
        return numericValue.padStart(2, "0");
      } else {
        return numericValue.slice(0, 1);
      }
    }
    return numericValue;
  };

  const validateYear = (value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 2);
    return numericValue;
  };

  const validateCVC = (value) => {
    return value.replace(/\D/g, "").slice(0, 3);
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    switch (name) {
      case "number":
        updatedValue = formatCardNumber(value);
        break;
      case "name":
        updatedValue = validateName(value);
        break;
      case "month":
        updatedValue = validateMonth(value);
        break;
      case "year":
        updatedValue = validateYear(value);
        break;
      case "cvc":
        updatedValue = validateCVC(value);
        break;
      default:
        break;
    }

    setCardInfo({ ...cardInfo, [name]: updatedValue });

    if (name === "cvc") {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  };

  const formatExpiryDate = () => {
    const month = cardInfo.month.padStart(2, "0");
    let year = cardInfo.year.padStart(2, "0");
    return `${month}/${year}`;
  };

  return (
    <Container className="mt-4 balance-container">
      <Row>
        <Col md={12}>
          <h2>Add Balance</h2>
          {error && (
            <Alert variant="danger" className="balance-alert">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="balance-alert">
              {success}
            </Alert>
          )}

          <h4 className="mt-4">Choose Amount:</h4>
          <div className="balance-amount-buttons mb-4">
            {[5, 10, 15, 20, 25, 50].map((amount) => (
              <Button
                key={amount}
                variant="dark"
                className={`balance-amount-button m-2 ${
                  selectedAmount === amount ? "active" : ""
                }`}
                onClick={() => setSelectedAmount(amount)}
                disabled={loading}
              >
                {amount} EUR
              </Button>
            ))}
          </div>

          <Row>
            <Col md={6}>
              <div className="balance-form-container">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Credit card number</Form.Label>
                    <Form.Control
                      type="text"
                      name="number"
                      value={cardInfo.number}
                      onChange={handleCardInputChange}
                      placeholder="1234-5678-9123-4567"
                      className="form-control"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Cardholder name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={cardInfo.name}
                      onChange={handleCardInputChange}
                      placeholder="FULL NAME"
                      className="form-control"
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Month</Form.Label>
                        <Form.Control
                          type="text"
                          name="month"
                          value={cardInfo.month}
                          onChange={handleCardInputChange}
                          placeholder="MM"
                          className="form-control"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                          type="text"
                          name="year"
                          value={cardInfo.year}
                          onChange={handleCardInputChange}
                          placeholder="YY"
                          className="form-control"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>CVC</Form.Label>
                        <Form.Control
                          type="text"
                          name="cvc"
                          value={cardInfo.cvc}
                          onChange={handleCardInputChange}
                          placeholder="CVC"
                          className="form-control"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    variant="dark"
                    onClick={handlePayment}
                    disabled={loading}
                    className="balance-submit-button w-100 mt-3"
                  >
                    {loading ? "Processing..." : "Add Funds"}
                  </Button>
                </Form>
              </div>
            </Col>

            <Col md={6}>
              <div className="balance-card-container">
                <div
                  className={`balance-card-wrapper ${
                    isFlipped ? "flipped" : ""
                  }`}
                >
                  <div className="balance-card balance-card-front">
                    <div className="balance-card-number">
                      {cardInfo.number || "XXXX-XXXX-XXXX-XXXX"}
                    </div>
                    <div className="balance-card-name">
                      {cardInfo.name || "CARDHOLDER NAME"}
                    </div>
                    <div className="balance-card-expiry">
                      {formatExpiryDate() || "MM/YY"}
                    </div>
                  </div>

                  <div className="balance-card balance-card-back">
                    <div className="balance-black-stripe"></div>
                    <div className="balance-cvc-box">
                      <label>CVC2/CVV2</label>
                      <div>{cardInfo.cvc || "XXX"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BalancePage;
