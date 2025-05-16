import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Image, Alert, ListGroup } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ForeignProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/userprofile/${id}`);
        if (response.status !== 200) throw new Error('Failed to fetch user data');
        console.log('API Response:', response.data);
        const data = response.data;
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/users/favorites/users', {
          headers: { 'x-access-token': token },
        });
        const favoriteUsers = response.data;
        console.log('Favorite users response:', favoriteUsers); 
        const isFav = favoriteUsers.some((fav) => fav.favUserId === parseInt(id));
        setIsFavorite(isFav);
      } catch (err) {
        console.error('Ошибка при проверке статуса избранного:', err);
      }
    };

    fetchUser();
    checkFavoriteStatus();
  }, [id]);

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete('http://localhost:5000/api/users/favorites/users', {
          headers: { 'x-access-token': token },
          data: { favUserId: user.id },
        });
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(
          'http://localhost:5000/api/users/favorites/users',
          { favUserId: user.id },
          { headers: { 'x-access-token': token } }
        );
        setIsFavorite(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update favorite status');
    }
  };

  const handleWriteMessage = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const myId = decoded.id;

      const response = await axios.post(
        'http://localhost:5000/api/chats/start',
        {
          userId: myId,
          user2Id: user.id,
        },
        {
          headers: { 'x-access-token': token },
        }
      );

      const chat = response.data;
      navigate('/messages', { state: { chat } });
    } catch (err) {
      console.error('Ошибка при создании чата:', err);
      setError('Failed to start chat');
    }
  };

  if (loading) return <Alert variant="info">Loading...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return <Alert variant="warning">User not found</Alert>;

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm mb-4">
        <div className="d-flex align-items-center">
          <Image
            src="https://avatar.iran.liara.run/public"
            roundedCircle
            className="me-3"
            width={100}
          />
          <div>
            <h4>{user.username}</h4>
            <p className="text-muted">
              DATE OF REGISTRATION: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <Button
            variant={isFavorite ? 'danger' : 'primary'}
            onClick={handleToggleFavorite}
            className="me-2"
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
          <Button variant="dark" onClick={handleWriteMessage}>
            Write Message
          </Button>
        </div>
      </Card>

      <Card className="p-4 shadow-sm mb-4">
        <h5>{user.username}'s Products</h5>
        {user.products && user.products.length > 0 ? (
          <ListGroup>
            {user.products.map((product) => (
              <ListGroup.Item
                key={product.id}
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center">
                  <Image
                    src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://placehold.co/400'}
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
                    <p className="text-muted mb-0">
                      Category: {product.category?.name || 'No Category'}
                    </p>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No products available.</p>
        )}
      </Card>
    </Container>
  );
};

export default ForeignProfilePage;