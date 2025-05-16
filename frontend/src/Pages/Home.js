import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  Spinner,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [dateFilter, setDateFilter] = useState("");
  const [sort, setSort] = useState("desc");
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      const fetchFavorites = async () => {
        setFavoritesLoading(true);
        try {
          const response = await axios.get(
            "http://localhost:5000/api/users/favorites",
            {
              headers: {
                "x-access-token": token,
                "Content-Type": "application/json",
              },
            }
          );
          setFavorites(response.data.map((fav) => fav.productId));
        } catch (err) {
          console.error("Error fetching favorites:", err);
        } finally {
          setFavoritesLoading(false);
        }
      };
      fetchFavorites();
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(response.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/products?minPrice=${
        priceRange[0]
      }&maxPrice=${priceRange[1]}&page=${currentPage}&limit=${productsPerPage}${
        selectedCategory ? `&category=${selectedCategory}` : ""
      }${searchQuery ? `&search=${searchQuery}` : ""}${
        dateFilter ? `&dateFilter=${dateFilter}` : ""
      }${sort ? `&sort=${sort}` : ""}`;

      const response = await axios.get(url);
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchProducts = debounce(() => {
    fetchProducts();
  }, 300);

  useEffect(() => {
    debouncedFetchProducts();
    return () => debouncedFetchProducts.cancel();
  }, [
    selectedCategory,
    priceRange,
    dateFilter,
    sort,
    currentPage,
    searchQuery,
  ]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleToggleFavorite = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      if (favorites.includes(productId)) {
        await axios.delete("http://localhost:5000/api/users/favorites", {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          data: { productId },
        });
        setFavorites(favorites.filter((id) => id !== productId));
      } else {
        await axios.post(
          "http://localhost:5000/api/users/favorites",
          { productId },
          {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );
        setFavorites([...favorites, productId]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update favorites");
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <style>
        {`
          .home-card {
            position: relative;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            transition: transform 0.2s;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .home-card:hover {
            transform: translateY(-5px);
          }
          .home-card img {
            width: 100%;
            height: 200px;
            object-fit: contain;
            border-radius: 8px;
            margin-bottom: 10px;
          }
          .home-card h6 {
            font-size: 1.1rem;
            margin-bottom: 5px;
          }
          .home-card strong {
            font-size: 1rem;
            margin-bottom: 5px;
          }
          .home-card p {
            font-size: 0.9rem;
            margin-bottom: 3px;
          }
          .favorite-icon {
            position: absolute;
            top: 20px;
            right: 20px;
            cursor: pointer;
          }
          .favorite-icon.loading {
            cursor: not-allowed;
            opacity: 0.5;
          }
        `}
      </style>
      <Container fluid className="home-container">
        <Row>
          <Col xs={12} md={3} className="p-4 border-end">
            <h5 className="mb-3">
              Price: ${priceRange[0]} - ${priceRange[1]}
            </h5>
            <RangeSlider
              min={0}
              max={100}
              value={priceRange}
              onInput={(value) => {
                setPriceRange(value);
                setCurrentPage(1);
              }}
              className="mb-4 custom-range-slider"
            />
            <h5 className="mt-4 mb-3">Categories</h5>
            <Form>
              <div
                className={`category-wrapper mb-2 ${
                  selectedCategory === "" ? "selected" : ""
                }`}
                onClick={() => handleCategoryClick("")}
              >
                <Form.Check
                  type="radio"
                  name="category"
                  label="All"
                  value=""
                  checked={selectedCategory === ""}
                  onChange={(e) => handleCategoryClick(e.target.value)}
                  className="custom-radio"
                />
              </div>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-wrapper mb-2 ${
                    selectedCategory === category.id.toString() ? "selected" : ""
                  }`}
                  onClick={() => handleCategoryClick(category.id.toString())}
                >
                  <Form.Check
                    type="radio"
                    name="category"
                    label={category.name}
                    value={category.id}
                    checked={selectedCategory === category.id.toString()}
                    onChange={(e) => handleCategoryClick(e.target.value)}
                    className="custom-radio"
                  />
                </div>
              ))}
            </Form>
          </Col>
          <Col xs={12} md={9} className="p-4">
            <Row className="mb-4 align-items-center">
              <Col xs={12} md={6} className="search-wrapper mb-2 mb-md-0">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="py-2"
                />
                <FaSearch className="search-icon" />
              </Col>
              <Col xs={12} md={6} className="d-flex justify-content-md-end">
                <Form.Select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 me-2"
                  style={{ maxWidth: "175px" }}
                >
                  <option value="desc">Newest</option>
                  <option value="asc">Oldest</option>
                </Form.Select>
                <Form.Select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2"
                  style={{ maxWidth: "175px" }}
                >
                  <option value="">All Dates</option>
                  <option value="day">Last Day</option>
                  <option value="week">Last Week</option>
                  <option value="year">Last Year</option>
                </Form.Select>
              </Col>
            </Row>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading && (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <Spinner animation="border" variant="primary" />
              </div>
            )}
            {!loading && (
              <Row className="g-4">
                {products.length > 0 ? (
                  products.map((product) => (
                    <Col xs={12} sm={6} md={4} key={product.id}>
                      <div className="home-card">
                        <Link to={`/product/${product.id}`} className="d-flex flex-column">
                          <img
                            src={
                              product.imageUrl
                                ? `http://localhost:5000${product.imageUrl}`
                                : "https://placehold.co/400"
                            }
                            alt={product.name}
                            onError={(e) => {
                              console.error(
                                `Failed to load image: http://localhost:5000${product.imageUrl}`
                              );
                              e.target.src = "https://placehold.co/400";
                            }}
                          />
                          <h6>{product.name}</h6>
                          <strong>${product.price}</strong>
                          <p>{product.category?.name || "No Category"}</p>
                          <p>{product.seller?.username || "Unknown User"}</p>
                          <p>{new Date(product.createdAt).toLocaleDateString()}</p>
                        </Link>
                        {isAuthenticated && (
                          <span
                            className={`favorite-icon ${favoritesLoading ? "loading" : ""}`}
                            onClick={
                              favoritesLoading
                                ? null
                                : () => handleToggleFavorite(product.id)
                            }
                          >
                            {favorites.includes(product.id) ? (
                              <FaHeart color="red" size={20} />
                            ) : (
                              <FaRegHeart color="var(--muted)" size={20} />
                            )}
                          </span>
                        )}
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <Alert variant="info">No products found.</Alert>
                  </Col>
                )}
              </Row>
            )}
            <Row className="mt-4">
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
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;