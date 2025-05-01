import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Image, Button, Card, Alert } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        console.log("Product response:", response.data); // Add logging to debug

        if (token) {
          const favoritesResponse = await axios.get('http://localhost:5000/api/users/favorites', {
            headers: {
              'x-access-token': token,
              'Content-Type': 'application/json',
            },
          });
          setIsFavorite(favoritesResponse.data.some((fav) => fav.productId === parseInt(id)));
        }
      } catch (err) {
        setError('Error during the product loading');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete('http://localhost:5000/api/users/favorites', {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
          data: { productId: parseInt(id) },
        });
        setIsFavorite(false);
      } else {
        await axios.post(
          'http://localhost:5000/api/users/favorites',
          { productId: parseInt(id) },
          {
            headers: {
              'x-access-token': token,
              'Content-Type': 'application/json',
            },
          }
        );
        setIsFavorite(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update favorites');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product isn't loaded</p>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
          <Image
            src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : "https://placehold.co/400"}
            alt={product.name}
            fluid
            rounded
            className="shadow-sm"
          />
        </Col>
        <Col md={8} lg={6}>
          <div className="d-flex align-items-center">
            <h1 className="fw-bold mt-3">{product.name}</h1>
            {isAuthenticated && (
              <span
                className="ms-3"
                style={{ cursor: 'pointer' }}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? <FaHeart color="red" size={24} /> : <FaRegHeart color="gray" size={24} />}
              </span>
            )}
          </div>
          <h2 className="fw-bold mt-2">${product.price}</h2>
          <p className="text-muted">{product.description}</p>
          <Button
            variant="dark"
            className="mt-3 w-100"
            onClick={() => navigate(`/purchase/${product.id}`)}
          >
            Buy
          </Button>
          <p className="text-muted">
            {new Date(product.createdAt).toLocaleDateString()}
          </p>
          <strong>{product.category?.name || 'No Category'}</strong>
          <Row className="mt-5">
            <Card className="p-3">
              <Card.Title>Author</Card.Title>
              {product.seller ? ( // Updated from product.user to product.seller
                <Card.Text>
                  <strong
                    style={{ cursor: 'pointer', color: '#007bff' }}
                    onClick={() => navigate(`/profile/${product.seller.id}`)} // Updated to product.seller.id
                  >
                    {product.seller.username}
                  </strong>{' '}
                  ({product.seller.email})
                </Card.Text>
              ) : (
                <Card.Text>Author unknown</Card.Text>
              )}
            </Card>
          </Row>
        </Col>
      </Row>
      <Row className="mt-5 border-top pt-4">
        <Col>
          <Alert variant="light" className="text-center">
            <strong>Notice!</strong>
            <p>
              Once the final purchase is completed and the payment has been processed, the item is
              non-refundable and cannot be returned. Please review your order carefully before
              completing the transaction.
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;