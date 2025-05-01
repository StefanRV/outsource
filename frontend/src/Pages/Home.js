import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Alert, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { FaHeart, FaRegHeart } from "react-icons/fa";
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
  const productsPerPage = 9; // Fixed number of products per page

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      const fetchFavorites = async () => {
        setFavoritesLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/api/users/favorites", {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          });
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
        const response = await axios.get("http://localhost:5000/api/categories");
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
      const url = `http://localhost:5000/api/products?minPrice=${priceRange[0]}&maxPrice=${
        priceRange[1]
      }&page=${currentPage}&limit=${productsPerPage}${
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
  }, [selectedCategory, priceRange, dateFilter, sort, currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
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

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="p-4 border-right">
          <h5>Categories</h5>
          <Form>
            <Form.Check
              type="radio"
              name="category"
              label="All"
              value=""
              checked={selectedCategory === ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            {categories.map((category) => (
              <Form.Check
                key={category.id}
                type="radio"
                name="category"
                label={category.name}
                value={category.id}
                checked={selectedCategory === category.id.toString()}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            ))}
          </Form>
          <h5>
            Price: ${priceRange[0]} - ${priceRange[1]}
          </h5>
          <RangeSlider
            min={0}
            max={100}
            value={priceRange}
            onInput={(value) => {
              setPriceRange(value);
              setCurrentPage(1); // Reset to first page on price change
            }}
          />
          <h5>Date Filter</h5>
          <Form.Select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on date filter change
            }}
            className="mb-3"
          >
            <option value="">All</option>
            <option value="day">Last Day</option>
            <option value="week">Last Week</option>
            <option value="year">Last Year</option>
          </Form.Select>
          <h5>Sort By</h5>
          <Form.Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1); // Reset to first page on sort change
            }}
            className="mb-3"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </Form.Select>
        </Col>
        <Col md={9} className="p-4">
          <Row className="mb-4 align-items-center">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
          </Row>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading && (
            <Spinner animation="border" className="d-block mx-auto mt-5" />
          )}
          {!loading && (
            <Row>
              {products.length > 0 ? (
                products.map((product) => (
                  <Col md={4} key={product.id} className="mb-4">
                    <div className="border rounded p-4 shadow-sm position-relative">
                      <Link
                        to={`/product/${product.id}`}
                        className="text-decoration-none text-dark"
                      >
                        <img
                          src={
                            product.imageUrl
                              ? `http://localhost:5000${product.imageUrl}`
                              : "https://placehold.co/400"
                          }
                          alt={product.name}
                          className="img-fluid mb-2"
                          style={{ height: "150px", objectFit: "cover" }}
                          onError={(e) => {
                            console.error(
                              `Failed to load image: http://localhost:5000${product.imageUrl}`
                            );
                            e.target.src = "https://placehold.co/400";
                          }}
                        />
                        <h6>{product.name}</h6>
                        <strong>${product.price}</strong>
                        <br />
                        <strong>{product.category?.name || "No Category"}</strong>
                        <p className="text-muted">
                          {product.seller?.username || "Unknown User"}
                        </p>
                        <p className="text-muted">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                      {isAuthenticated && (
                        <span
                          className="position-absolute top-0 end-0 p-2"
                          style={{
                            cursor: favoritesLoading ? "not-allowed" : "pointer",
                            zIndex: 1,
                          }}
                          onClick={
                            favoritesLoading
                              ? null
                              : () => handleToggleFavorite(product.id)
                          }
                        >
                          {favorites.includes(product.id) ? (
                            <FaHeart color="black" size={20} />
                          ) : (
                            <FaRegHeart color="gray" size={20} />
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
              <Button
                variant="outline-dark"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="me-2"
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline-dark"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ms-2"
              >
                Next
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;