import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Image, ListGroup, Form, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoriteUsers, setFavoriteUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error || 'Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/favorites', {
          headers: { 'x-access-token': token },
        });
        setFavorites(res.data);
      } catch (err) {
        console.error('Ошибка при получении избранных продуктов:', err);
      }
    };

    const fetchFavoriteUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/favorites/users', {
          headers: { 'x-access-token': token },
        });
        setFavoriteUsers(res.data);
      } catch (err) {
        console.error('Ошибка при получении избранных пользователей:', err);
      }
    };

    fetchFavorites();
    fetchFavoriteUsers();
  }, []);

  useEffect(() => {
  }, [favoriteUsers]);

  const handleRemoveFavorite = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/favorites', {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove favorite');
      }

      setFavorites((prev) => prev.filter((fav) => fav.productId !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveFavoriteUser = async (favUserId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/favorites/users', {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove favorite user');
      }

      setFavoriteUsers((prev) => prev.filter((fav) => fav.favUserId !== favUserId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="text-center mt-5">{error}</Alert>;

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm mb-4">
        <div className="d-flex align-items-center">
          <Image src="https://avatar.iran.liara.run/public" roundedCircle className="me-3" width={100} />
          <div>
            <h4>{user.username}</h4>
            <p className="text-muted">
              DATE OF REGISTRATION: {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p className="text-muted">BALANCE: {user.balance}€</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 shadow-sm mb-4">
        <h5>Create a New Product</h5>
        <Button variant="primary" onClick={handleAddProduct}>
          Add new product
        </Button>
      </Card>

      <Card className="p-4 shadow-sm mb-4">
        <h5>Your Products</h5>
        {user.products && user.products.length > 0 ? (
          <ListGroup>
            {user.products.map((product) => (
              <ListGroup.Item key={product.id} className="d-flex align-items-center">
                <Image
                  src={product.imageUrl || 'https://placehold.co/400'}
                  thumbnail
                  style={{ width: '50px', height: '50px', marginRight: '15px' }}
                />
                <div>
                  <h6>{product.name}</h6>
                  <p className="text-muted mb-0">Price: {product.price}€</p>
                </div>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditProduct(product.id)}
                >
                  Edit
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No products yet.</p>
        )}
      </Card>

      <Card className="p-4 shadow-sm mb-4">
        <h5>Favorites</h5>
        <p className="text-muted mb-3">Total Favorite Products: {favorites.length}</p>
        <Tabs
          defaultActiveKey="products"
          id="favorites-tabs"
          className="mb-3"
          
        >
          <Tab eventKey="products" title="Favorite Products">
            {favorites && favorites.length > 0 ? (
              <ListGroup>
                <p className="text-muted mb-3">Total Favorite Products: {favorites.length}</p>
                {favorites.map((favorite) => {
                  const product = favorite.product;
                  if (!product) return null;
                  return (
                    <ListGroup.Item
                      key={favorite.id}
                      className="d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <Image
                          src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : "https://placehold.co/400"}
                          alt={product.name}
                          thumbnail
                          style={{ width: '50px', height: '50px', marginRight: '15px' }}
                        />
                        <div>
                          <h6
                            style={{ cursor: 'pointer', color: '#007bff' }}
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            {product.name}
                          </h6>
                          <p className="text-muted mb-0">Price: {product.price}€</p>
                          <p className="text-muted mb-0">Category: {product.category?.name || 'No Category'}</p>
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveFavorite(product.id)}
                      >
                        Remove
                      </Button>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              <p>No favorite products yet.</p>
            )}
          </Tab>
          <Tab eventKey="users" title="Favorite Users">
            <p className="text-muted mb-3" style={{ color: 'red', fontWeight: 'bold' }}>
              Total Favorite Users: {favoriteUsers ? favoriteUsers.length : 0}
            </p>
            {favoriteUsers && favoriteUsers.length > 0 ? (
              <ListGroup>
                {favoriteUsers.map((favorite) => {
                  const favUser = favorite.favUser;
                  if (!favUser) return null;
                  return (
                    <ListGroup.Item
                      key={favorite.id}
                      className="d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center">
                        <Image
                          src="https://avatar.iran.liara.run/public"
                          roundedCircle
                          style={{ width: '50px', height: '50px', marginRight: '15px' }}
                        />
                        <div>
                          <h6
                            style={{ cursor: 'pointer', color: '#007bff' }}
                            onClick={() => navigate(`/profile/${favUser.id}`)}
                          >
                            {favUser.username}
                          </h6>
                          <p className="text-muted mb-0">
                            Registered: {new Date(favUser.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-muted mb-0">
                            Products Created: {favUser.products?.length || 0}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveFavoriteUser(favUser.id)}
                      >
                        Remove
                      </Button>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              <p>No favorite users yet.</p>
            )}
          </Tab>
        </Tabs>
      </Card>

      <div className="text-center mt-4">
        <Button variant="dark" onClick={onLogout}>
          Log out
        </Button>
      </div>
    </Container>
  );
}