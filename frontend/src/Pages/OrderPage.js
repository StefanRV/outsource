import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const OrdersPage = ({ isAdmin: isAdminProp }) => {
  const [isAdmin, setIsAdmin] = useState(isAdminProp ?? null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (isAdminProp === undefined) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsAdmin(decoded.role === "admin");
        } catch (err) {
          console.error("Invalid token", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }
  }, [isAdminProp]);

  useEffect(() => {
    if (isAdmin === null) return;

    const fetchOrders = async () => {
      try {
        const url = isAdmin
          ? `http://localhost:5000/api/orders/all?page=${currentPage}&limit=${itemsPerPage}&sort=createdAt,desc`
          : `http://localhost:5000/api/orders/user?page=${currentPage}&limit=${itemsPerPage}&sort=createdAt,desc`;
        const res = await axios.get(url, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin, currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (isAdmin === null || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="orders-container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="orders-container">
      <h2 className="mb-4">{isAdmin ? "All Orders" : "My Orders"}</h2>
      {orders.length === 0 ? (
        <Alert variant="info">No orders found.</Alert>
      ) : (
        <>
          <Row className="g-4">
            {orders.map((order, index) => (
              <Col xs={12} sm={6} md={4} key={order.id}>
                <div className="order-card">
                  <img
                    src={
                      order.OrderItems[0]?.Product?.imageUrl
                        ? `http://localhost:5000${order.OrderItems[0].Product.imageUrl}`
                        : "https://placehold.co/400"
                    }
                    alt="Product"
                    className="product-image"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400";
                    }}
                  />
                  <div className="order-details">
                    <h5>Order #{index + 1}</h5>
                    <ul className="order-items-list">
                      {order.OrderItems.slice(0, 2).map((item) => (
                        <li key={item.id}>
                          <Link
                            to={`/product/${item.Product.id}`}
                            className="text-decoration-none"
                          >
                            {item.Product.title}
                          </Link>{" "}
                          - {item.quantity} x ${item.price}
                        </li>
                      ))}
                      {order.OrderItems.length > 2 && <li>...</li>}
                    </ul>
                    <p>
                      <strong>Total:</strong> ${order.totalPrice}
                    </p>
                    <p className="text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <Row className="mt-4 mb-4">
            <Col className="text-center">
              <div className="pagination-wrapper">
                <button
                  className="nav-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="nav-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default OrdersPage;