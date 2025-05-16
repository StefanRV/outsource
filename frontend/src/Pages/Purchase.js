import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const PurchasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity] = useState(1); 
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: "GET",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handlePurchase = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      setError("Authentication error. Please log in again.");
      return;
    }

    try {
      const payload = {
        userId: user.id,
        products: [{ productId: product.id, quantity }],
      };

      const res = await axios.post('http://localhost:5000/api/orders', payload, {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      });

      setSuccessMsg(`Order #${res.data.orderId} created successfully! Downloading file...`);
      
      const purchasedProduct = res.data.purchasedProducts.find(p => p.id === parseInt(id));
      if (purchasedProduct && purchasedProduct.fileUrl) {
        setDownloading(true);
        const response = await axios.get(`http://localhost:5000${purchasedProduct.fileUrl}`, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const extension = purchasedProduct.fileUrl.split('.').pop(); 
        const filename = purchasedProduct.name.replace(/\s+/g, '') + '.' + extension;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      setTimeout(() => {
        navigate('/');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Purchase failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="text-center mt-5">{error}</Alert>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <Card.Title className="fw-bold">Purchase Product</Card.Title>
            <Card.Body>
              <h4>{product.name}</h4>
              <p className="text-muted">{product.description}</p>
              <p>Price: <strong>${product.price}</strong></p>
              <p className="fw-bold">Total: ${product.price}</p>
              <Button 
                variant="dark" 
                className="w-100" 
                onClick={handlePurchase}
                disabled={downloading}
              >
                {downloading ? 'Downloading...' : 'Confirm Purchase'}
              </Button>
              {successMsg && <Alert variant="success" className="mt-3">{successMsg}</Alert>}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PurchasePage;