import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(response.data);

        if (token) {
          const favoritesResponse = await axios.get(
            "http://localhost:5000/api/users/favorites",
            {
              headers: {
                "x-access-token": token,
                "Content-Type": "application/json",
              },
            }
          );
          setIsFavorite(
            favoritesResponse.data.some((fav) => fav.productId === parseInt(id))
          );
        }
      } catch (err) {
        setError("Error during the product loading");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setFavoritesLoading(true);
    try {
      if (isFavorite) {
        await axios.delete("http://localhost:5000/api/users/favorites", {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          data: { productId: parseInt(id) },
        });
        setIsFavorite(false);
      } else {
        await axios.post(
          "http://localhost:5000/api/users/favorites",
          { productId: parseInt(id) },
          {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );
        setIsFavorite(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update favorites");
    } finally {
      setFavoritesLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="product-container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="product-container">
        <Alert variant="info">Product isn't loaded</Alert>
      </Container>
    );
  }

  return (
    <>
      <style>
        {`
          .product-image-page {
            width: 100%;
            max-height: 400px;
            object-fit: contain;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .product-details {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .product-details h1 {
            font-size: 2rem;
            margin-bottom: 0;
          }
          .product-details .category {
            font-size: 1.1rem;
            margin-bottom: 5px;
          }
          .product-details .price {
            font-size: 1.5rem;
            margin-bottom: 10px;
          }
          .product-details .description {
            font-size: 1rem;
            margin-bottom: 10px;
          }
          .product-details .date {
            font-size: 0.9rem;
            margin-bottom: 15px;
          }
          .favorite-icon {
            margin-left: 15px;
            cursor: pointer;
          }
          .favorite-icon.loading {
            cursor: not-allowed;
            opacity: 0.5;
          }
          .author-card {
            padding: 15px;
            margin-top: 15px;
          }
          .author-card .card-title {
            font-size: 1.2rem;
            margin-bottom: 10px;
          }
          .author-card .card-text {
            font-size: 1rem;
          }
          .notice-alert {
            padding: 15px;
          }
        `}
      </style>
      <Container className="product-container">
        <Row className="g-4 justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Image
              src={
                product.imageUrl
                  ? `http://localhost:5000${product.imageUrl}`
                  : "https://placehold.co/600"
              }
              alt={product.name}
              className="product-image-page"
              onError={(e) => {
                e.target.src = "https://placehold.co/600";
              }}
            />
          </Col>
          <Col xs={12} md={8} lg={6} className="product-details">
            <div className="d-flex align-items-center mb-3">
              <h1>{product.name}</h1>
              {isAuthenticated && (
                <span
                  className={`favorite-icon ${favoritesLoading ? "loading" : ""}`}
                  onClick={favoritesLoading ? null : handleToggleFavorite}
                >
                  {isFavorite ? (
                    <FaHeart color="red" size={24} />
                  ) : (
                    <FaRegHeart color="var(--muted)" size={24} />
                  )}
                </span>
              )}
            </div>
            <strong className="category">
              {product.category?.name || "Textures"}
            </strong>
            <h2 className="price">${product.price}</h2>
            <p className="description">{product.description}</p>
            <p className="date">
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
            <Button
              variant="primary"
              className="w-100 py-2"
              onClick={() => navigate(`/purchase/${product.id}`)}
            >
              Buy
            </Button>
            <Card className="author-card w-100">
              <Card.Title>Author</Card.Title>
              <Card.Text>
                {product.seller ? (
                  <>
                    <strong
                      className={userId === product.seller.id ? "disabled" : ""}
                      onClick={
                        userId === product.seller.id
                          ? undefined
                          : () => navigate(`/profile/${product.seller.id}`)
                      }
                    >
                      {product.seller.username}
                    </strong>{" "}
                    ({product.seller.email})
                  </>
                ) : (
                  "Author unknown"
                )}
              </Card.Text>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Alert className="notice-alert">
              <strong>Notice!</strong>
              <p>
                Once the final purchase is completed and the payment has been
                processed, the item is non-refundable and cannot be returned.
                Please review your order carefully before completing the
                transaction.
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductPage;