import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Dashboard() {
  const [summaryStats, setSummaryStats] = useState({
    purchases: 0,
    products: 0,
    users: 0,
    forumTopics: 0,
    income: 0,
  });
  const [productCategories, setProductCategories] = useState([]);
  const [forumCategories, setForumCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [forumTopics, setForumTopics] = useState([]);
  const [filteredForumTopics, setFilteredForumTopics] = useState([]);
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newForumCategory, setNewForumCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        navigate("/");
        return;
      }

      const fetchData = async () => {
        try {
          const statsResponse = await axios.get(
            "http://localhost:5000/api/dashboard/stats",
            { headers: { "x-access-token": token } }
          );
          setSummaryStats(statsResponse.data);

          const productCategoriesResponse = await axios.get(
            "http://localhost:5000/api/categories",
            { headers: { "x-access-token": token } }
          );
          setProductCategories(productCategoriesResponse.data || []);

          const forumCategoriesResponse = await axios.get(
            "http://localhost:5000/api/forumCategories",
            { headers: { "x-access-token": token } }
          );
          setForumCategories(forumCategoriesResponse.data || []);

          const ordersResponse = await axios.get(
            "http://localhost:5000/api/orders/all",
            { headers: { "x-access-token": token } }
          );
          const ordersData = Array.isArray(ordersResponse.data)
            ? ordersResponse.data
            : ordersResponse.data.orders || [];
          setOrders(ordersData);
          setFilteredOrders(ordersData);

          const productsResponse = await axios.get(
            "http://localhost:5000/api/products",
            { headers: { "x-access-token": token } }
          );
          const productsData = Array.isArray(productsResponse.data)
            ? productsResponse.data
            : productsResponse.data.products || [];
          setProducts(productsData);
          setFilteredProducts(productsData);

          const usersResponse = await axios.get(
            "http://localhost:5000/api/users/user",
            { headers: { "x-access-token": token } }
          );
          const usersData = Array.isArray(usersResponse.data)
            ? usersResponse.data
            : usersResponse.data.users || [];
          setUsers(usersData);
          setFilteredUsers(usersData);

          const forumTopicsResponse = await axios.get(
            "http://localhost:5000/api/topics",
            { headers: { "x-access-token": token } }
          );
          const topicsData = Array.isArray(forumTopicsResponse.data)
            ? forumTopicsResponse.data
            : forumTopicsResponse.data.topics || [];
          setForumTopics(topicsData);
          setFilteredForumTopics(topicsData);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch data");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } catch (err) {
      setError("Invalid token");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "purchases") {
      const filtered = Array.isArray(orders)
        ? orders.filter(
            (order) =>
              order.id.toString().includes(searchQuery) ||
              (order.buyer?.username || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (order.buyer?.email || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        : [];
      const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
      setFilteredOrders(sorted);
      setCurrentPage(1);
    } else if (activeTab === "products") {
      const filtered = Array.isArray(products)
        ? products.filter(
            (product) =>
              (product.name || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (product.description || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        : [];
      const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
      setFilteredProducts(sorted);
      setCurrentPage(1);
    } else if (activeTab === "users") {
      const filtered = Array.isArray(users)
        ? users.filter(
            (user) =>
              (user.username || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (user.email || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        : [];
      const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
      setFilteredUsers(sorted);
      setCurrentPage(1);
    } else if (activeTab === "forum-topics") {
      const filtered = Array.isArray(forumTopics)
        ? forumTopics.filter(
            (topic) =>
              (topic.title || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (topic.content || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (topic.author?.username || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        : [];
      const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
      setFilteredForumTopics(sorted);
      setCurrentPage(1);
    }
  }, [searchQuery, sortOrder, activeTab, orders, products, users, forumTopics]);

  const handleAddProductCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !newProductCategory) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/categories",
        { name: newProductCategory },
        { headers: { "x-access-token": token } }
      );
      setProductCategories([...productCategories, response.data]);
      setNewProductCategory("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product category");
    }
  };

  const handleAddForumCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !newForumCategory) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/forumCategories",
        { name: newForumCategory },
        { headers: { "x-access-token": token } }
      );
      setForumCategories([...forumCategories, response.data]);
      setNewForumCategory("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add forum category");
    }
  };

  const handleRemoveProductCategory = async (categoryId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
        headers: { "x-access-token": token },
      });
      setProductCategories(
        productCategories.filter((category) => category.id !== categoryId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to remove product category"
      );
    }
  };

  const handleRemoveForumCategory = async (categoryId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/forumCategories/${categoryId}`,
        { headers: { "x-access-token": token } }
      );
      setForumCategories(
        forumCategories.filter((category) => category.id !== categoryId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to remove forum category"
      );
    }
  };
  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/user/${userId}`, {
          headers: { "x-access-token": token },
        });
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
        setSummaryStats((prev) => ({ ...prev, users: prev.users - 1 }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user");
      }
    }
  };
  const handleEditProductCategory = (categoryId) => {
    navigate(`/edit-product-category/${categoryId}`);
  };

  const handleEditForumCategory = (categoryId) => {
    navigate(`/edit-forum-category/${categoryId}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setSortOrder("newest");
    setCurrentPage(1);
  };

  const paginateItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const totalPages = (items) => Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages(getCurrentItems())) {
      setCurrentPage(page);
    }
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case "purchases":
        return filteredOrders;
      case "products":
        return filteredProducts;
      case "users":
        return filteredUsers;
      case "forum-topics":
        return filteredForumTopics;
      default:
        return [];
    }
  };

  const pageNumbers = (items) => {
    const pages = [];
    for (let i = 1; i <= totalPages(items); i++) {
      pages.push(i);
    }
    return pages;
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
      <Alert variant="danger" className="text-center mt-5">
        {error}
      </Alert>
    );
  }

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={3} lg={2} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title className="mb-3">Dashboard</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                Data Overview
              </Card.Subtitle>
              <ListGroup variant="flush">
                {[
                  "overview",
                  "purchases",
                  "products",
                  "users",
                  "forum-topics",
                ].map((tab) => (
                  <ListGroup.Item
                    key={tab}
                    action
                    active={activeTab === tab}
                    onClick={() => handleTabSelect(tab)}
                    className="py-3"
                  >
                    {tab.charAt(0).toUpperCase() +
                      tab.slice(1).replace("-", " ")}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9} lg={10}>
          <Row className="mb-4 g-3">
            {[
              { title: summaryStats.purchases, text: "Total Purchases" },
              { title: summaryStats.products, text: "Total Products" },
              { title: summaryStats.users, text: "Active Users" },
              { title: summaryStats.forumTopics, text: "Total Topics" },
              {
                title: `$${summaryStats.income.toLocaleString()}`,
                text: "Total Income",
              },
            ].map((stat, index) => (
              <Col xs={6} md={4} lg={2} key={index}>
                <Card className="dashboard-card summary-card">
                  <Card.Body>
                    <Card.Title>{stat.title}</Card.Title>
                    <Card.Text>{stat.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="dashboard-card">
            <Card.Body>
              {activeTab !== "overview" && (
                <Row className="mb-4 align-items-center">
                  <Col md={6} className="mb-2 mb-md-0">
                    <Form.Control
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="py-2"
                    />
                  </Col>
                  <Col md={6} className="text-md-end">
                    <Button
                      className={`btn-outline me-2 ${
                        sortOrder === "newest" ? "btn-primary" : ""
                      }`}
                      onClick={() => handleSortChange("newest")}
                    >
                      Newest
                    </Button>
                    <Button
                      className={`btn-outline ${
                        sortOrder === "lasted" ? "btn-primary" : ""
                      }`}
                      onClick={() => handleSortChange("lasted")}
                    >
                      Latest
                    </Button>
                  </Col>
                </Row>
              )}

              {activeTab === "overview" && (
                <>
                  <Card.Title className="mb-3">Add Product Category</Card.Title>
                  <Form onSubmit={handleAddProductCategory} className="mb-4">
                    <Form.Group as={Row} className="align-items-center">
                      <Col xs={12} md={9}>
                        <Form.Control
                          type="text"
                          placeholder="Enter category name"
                          value={newProductCategory}
                          onChange={(e) =>
                            setNewProductCategory(e.target.value)
                          }
                          className="py-2"
                        />
                      </Col>
                      <Col xs={12} md={3} className="mt-2 mt-md-0 text-md-end">
                        <Button
                          className="btn-primary w-100 w-md-auto"
                          type="submit"
                        >
                          Add
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>

                  <Card.Subtitle className="mb-3 text-muted">
                    Product Categories
                  </Card.Subtitle>
                  {productCategories.length > 0 ? (
                    productCategories.map((category) => (
                      <Row
                        key={category.id}
                        className="category-item mb-2 align-items-center"
                      >
                        <Col xs={12} md={6} className="mb-2 mb-md-0">
                          {category.name}
                        </Col>
                        <Col xs={12} md={6} className="text-md-end">
                          <Button
                            className="btn-secondary me-2"
                            onClick={() =>
                              handleRemoveProductCategory(category.id)
                            }
                          >
                            Remove
                          </Button>
                          <Button
                            className="btn-primary"
                            onClick={() =>
                              handleEditProductCategory(category.id)
                            }
                          >
                            Edit
                          </Button>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Alert variant="info">No product categories yet.</Alert>
                  )}

                  <Card.Title className="mt-4 mb-3">
                    Add Forum Category
                  </Card.Title>
                  <Form onSubmit={handleAddForumCategory} className="mb-4">
                    <Form.Group as={Row} className="align-items-center">
                      <Col xs={12} md={9}>
                        <Form.Control
                          type="text"
                          placeholder="Enter category name"
                          value={newForumCategory}
                          onChange={(e) => setNewForumCategory(e.target.value)}
                          className="py-2"
                        />
                      </Col>
                      <Col xs={12} md={3} className="mt-2 mt-md-0 text-md-end">
                        <Button
                          className="btn-primary w-100 w-md-auto"
                          type="submit"
                        >
                          Add
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>

                  <Card.Subtitle className="mb-3 text-muted">
                    Forum Categories
                  </Card.Subtitle>
                  {forumCategories.length > 0 ? (
                    forumCategories.map((category) => (
                      <Row
                        key={category.id}
                        className="category-item mb-2 align-items-center"
                      >
                        <Col xs={12} md={6} className="mb-2 mb-md-0">
                          {category.name}
                        </Col>
                        <Col xs={12} md={6} className="text-md-end">
                          <Button
                            className="btn-secondary me-2"
                            onClick={() =>
                              handleRemoveForumCategory(category.id)
                            }
                          >
                            Remove
                          </Button>
                          <Button
                            className="btn-primary"
                            onClick={() => handleEditForumCategory(category.id)}
                          >
                            Edit
                          </Button>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Alert variant="info">No forum categories yet.</Alert>
                  )}
                </>
              )}

              {activeTab === "purchases" && (
                <>
                  {paginateItems(filteredOrders).length > 0 ? (
                    paginateItems(filteredOrders).map((order) => (
                      <div key={order.id} className="tab-content-item">
                        <p>
                          <strong>Order #{order.id}</strong> - Cassette tape.png
                        </p>
                        <p>
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          User: {order.buyer?.username || "Unknown"} [
                          {order.buyer?.email || "N/A"}]
                        </p>
                        <p>Sum: ${order.totalPrice}</p>
                      </div>
                    ))
                  ) : (
                    <Alert variant="info">No orders found.</Alert>
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
                        {pageNumbers(filteredOrders).map((page) => (
                          <button
                            key={page}
                            className={`page-btn ${
                              currentPage === page ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          className="nav-btn"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages(filteredOrders)}
                        >
                          Next
                        </button>
                      </div>
                    </Col>
                  </Row>
                </>
              )}

              {activeTab === "products" && (
                <>
                  {paginateItems(filteredProducts).length > 0 ? (
                    paginateItems(filteredProducts).map((product) => (
                      <div key={product.id} className="tab-content-item">
                        <p>
                          <strong>Product #{product.id}</strong> -{" "}
                          {product.name}
                        </p>
                        <p>Description: {product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>
                          Created:{" "}
                          {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <Alert variant="info">No products found.</Alert>
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
                        {pageNumbers(filteredProducts).map((page) => (
                          <button
                            key={page}
                            className={`page-btn ${
                              currentPage === page ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          className="nav-btn"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage === totalPages(filteredProducts)
                          }
                        >
                          Next
                        </button>
                      </div>
                    </Col>
                  </Row>
                </>
              )}

              {activeTab === "users" && (
                <>
                  {paginateItems(filteredUsers).length > 0 ? (
                    paginateItems(filteredUsers).map((user) => (
                      <Row
                        key={user.id}
                        className="category-item mb-2 align-items-center"
                      >
                        <Col xs={12} md={6} className="mb-2 mb-md-0">
                          <div>
                            <strong>User #{user.id}</strong> - {user.username}
                          </div>
                          <div>Email: {user.email}</div>
                          <div>Role: {user.role}</div>
                          <div>
                            Registered:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </Col>
                        <Col xs={12} md={6} className="text-md-end">
                          <Button
                            className="btn-secondary me-2"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Alert variant="info">No users found.</Alert>
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
                        {pageNumbers(filteredUsers).map((page) => (
                          <button
                            key={page}
                            className={`page-btn ${
                              currentPage === page ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          className="nav-btn"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages(filteredUsers)}
                        >
                          Next
                        </button>
                      </div>
                    </Col>
                  </Row>
                </>
              )}

              {activeTab === "forum-topics" && (
                <>
                  {paginateItems(filteredForumTopics).length > 0 ? (
                    paginateItems(filteredForumTopics).map((topic) => (
                      <div key={topic.id} className="tab-content-item">
                        <p>
                          <strong>Topic #{topic.id}</strong> - {topic.title}
                        </p>
                        <p>Content: {topic.content.substring(0, 150)}...</p>
                        <p>Author: {topic.author?.username || "Anonymous"}</p>
                        <p>
                          Created:{" "}
                          {new Date(topic.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <Alert variant="info">No forum topics found.</Alert>
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
                        {pageNumbers(filteredForumTopics).map((page) => (
                          <button
                            key={page}
                            className={`page-btn ${
                              currentPage === page ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          className="nav-btn"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage === totalPages(filteredForumTopics)
                          }
                        >
                          Next
                        </button>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
