import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const OrdersPage = ({ isAdmin: isAdminProp }) => {
    const [isAdmin, setIsAdmin] = useState(isAdminProp ?? null); 
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    
    useEffect(() => {
      if (isAdminProp === undefined) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setIsAdmin(decoded.role === 'admin');
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
            ? "http://localhost:5000/api/orders/all"
            : "http://localhost:5000/api/orders/user";
          const res = await axios.get(url, {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          });
          setOrders(res.data.orders);
        } catch (err) {
          setError(err.response?.data?.error || "Failed to load orders");
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, [isAdmin]);
  
    if (isAdmin === null || loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
  
    return (
      <div className="container mt-4">
        <h2>{isAdmin ? "All orders" : "My orders"}</h2>
        {orders.map((order) => (
          <Card key={order.id} className="mb-3">
            <Card.Body>
              <Card.Title>
                Order #{order.id} — {new Date(order.createdAt).toLocaleDateString()}
              </Card.Title>
              <Card.Text>
                <strong>Sum:</strong> ${order.totalPrice}
                <br />
                {isAdmin && order.User && (
                  <>
                    <strong>User:</strong> {order.User.username} ({order.User.email})
                    <br />
                  </>
                )}
              </Card.Text>
              <ul>
                {order.OrderItems.map((item) => (
                  <li key={item.id}>
                    <Link to={`/product/${item.Product.id}`}>{item.Product.title}</Link> — {item.quantity} шт. × ${item.price}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };
  

export default OrdersPage;
