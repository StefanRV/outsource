import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newForumCategory, setNewForumCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Display 5 items per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        navigate('/');
        return;
      }

      const fetchData = async () => {
        try {
          // Fetch summary statistics
          const statsResponse = await axios.get('http://localhost:5000/api/dashboard/stats', {
            headers: { 'x-access-token': token },
          });
          setSummaryStats(statsResponse.data);

          // Fetch Product Categories
          const productCategoriesResponse = await axios.get('http://localhost:5000/api/categories', {
            headers: { 'x-access-token': token },
          });
          setProductCategories(productCategoriesResponse.data || []);

          // Fetch Forum Categories
          const forumCategoriesResponse = await axios.get('http://localhost:5000/api/forumCategories', {
            headers: { 'x-access-token': token },
          });
          setForumCategories(forumCategoriesResponse.data || []);

          // Fetch Orders
          const ordersResponse = await axios.get('http://localhost:5000/api/orders/all', {
            headers: { 'x-access-token': token },
          });
          console.log('Orders Response:', ordersResponse.data); // Debug the response
          const ordersData = Array.isArray(ordersResponse.data) ? ordersResponse.data : ordersResponse.data.orders || [];
          setOrders(ordersData);
          setFilteredOrders(ordersData);

          // Fetch Products
          const productsResponse = await axios.get('http://localhost:5000/api/products', {
            headers: { 'x-access-token': token },
          });
          const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : productsResponse.data.products || [];
          setProducts(productsData);
          setFilteredProducts(productsData);

          // Fetch Users
          const usersResponse = await axios.get('http://localhost:5000/api/users/user', {
            headers: { 'x-access-token': token },
          });
          const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data.users || [];
          setUsers(usersData);
          setFilteredUsers(usersData);

          // Fetch Forum Topics
          const forumTopicsResponse = await axios.get('http://localhost:5000/api/topics', {
            headers: { 'x-access-token': token },
          });
          const topicsData = Array.isArray(forumTopicsResponse.data) ? forumTopicsResponse.data : forumTopicsResponse.data.topics || [];
          setForumTopics(topicsData);
          setFilteredForumTopics(topicsData);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } catch (err) {
      setError('Invalid token');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  // Handle search and sorting for each tab
  useEffect(() => {
    if (activeTab === 'purchases') {
      const filtered = Array.isArray(orders)
        ? orders.filter(
            (order) =>
              order.id.toString().includes(searchQuery) ||
              (order.user?.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (order.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];
      const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
      setFilteredOrders(sorted);
      setCurrentPage(1); // Reset to first page on search/sort
    } else if (activeTab === 'products') {
      const filtered = Array.isArray(products)
        ? products.filter(
            (product) =>
              (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];
      const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
      setFilteredProducts(sorted);
      setCurrentPage(1);
    } else if (activeTab === 'users') {
      const filtered = Array.isArray(users)
        ? users.filter(
            (user) =>
              (user.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];
      const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
      setFilteredUsers(sorted);
      setCurrentPage(1);
    } else if (activeTab === 'forum-topics') {
      const filtered = Array.isArray(forumTopics)
        ? forumTopics.filter(
            (topic) =>
              (topic.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (topic.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (topic.author?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];
      const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === 'newest') {
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
    const token = localStorage.getItem('token');
    if (!token || !newProductCategory) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/categories',
        { name: newProductCategory },
        { headers: { 'x-access-token': token } }
      );
      setProductCategories([...productCategories, response.data]);
      setNewProductCategory('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product category');
    }
  };

  const handleAddForumCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !newForumCategory) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/forumCategories',
        { name: newForumCategory },
        { headers: { 'x-access-token': token } }
      );
      setForumCategories([...forumCategories, response.data]);
      setNewForumCategory('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add forum category');
    }
  };

  const handleRemoveProductCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
        headers: { 'x-access-token': token },
      });
      setProductCategories(productCategories.filter((category) => category.id !== categoryId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove product category');
    }
  };

  const handleRemoveForumCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/forumCategories/${categoryId}`, {
        headers: { 'x-access-token': token },
      });
      setForumCategories(forumCategories.filter((category) => category.id !== categoryId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove forum category');
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
    setSearchQuery(''); // Reset search query when switching tabs
    setSortOrder('newest'); // Reset sort order when switching tabs
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  // Pagination logic
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
      case 'purchases':
        return filteredOrders;
      case 'products':
        return filteredProducts;
      case 'users':
        return filteredUsers;
      case 'forum-topics':
        return filteredForumTopics;
      default:
        return [];
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="text-center mt-5">{error}</Alert>;

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Sidebar with Tabs */}
        <Col md={2} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Dashboard</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Data Overview</Card.Subtitle>
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  active={activeTab === 'overview'}
                  onClick={() => handleTabSelect('overview')}
                >
                  Overview
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeTab === 'purchases'}
                  onClick={() => handleTabSelect('purchases')}
                >
                  Purchases
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeTab === 'products'}
                  onClick={() => handleTabSelect('products')}
                >
                  Products
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeTab === 'users'}
                  onClick={() => handleTabSelect('users')}
                >
                  Users
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeTab === 'forum-topics'}
                  onClick={() => handleTabSelect('forum-topics')}
                >
                  Forum Topics
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col md={10}>
          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={2}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <Card.Title>{summaryStats.purchases}</Card.Title>
                  <Card.Text>Total Purchases</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <Card.Title>{summaryStats.products}</Card.Title>
                  <Card.Text>Total Products</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <Card.Title>{summaryStats.users}</Card.Title>
                  <Card.Text>Active Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <Card.Title>{summaryStats.forumTopics}</Card.Title>
                  <Card.Text>Total Topics</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2}>
              <Card className="shadow-sm text-center">
                <Card.Body>
                  <Card.Title>${summaryStats.income.toLocaleString()}</Card.Title>
                  <Card.Text>Total Income</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tab Content */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              {/* Search and Sort Controls (Hidden for Overview) */}
              {activeTab !== 'overview' && (
                <Row className="mb-4 align-items-center">
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </Col>
                  <Col md={6} className="text-end">
                    <Button
                      variant={sortOrder === 'newest' ? 'dark' : 'outline-dark'}
                      className="me-2"
                      onClick={() => handleSortChange('newest')}
                    >
                      Newest
                    </Button>
                    <Button
                      variant={sortOrder === 'lasted' ? 'dark' : 'outline-dark'}
                      onClick={() => handleSortChange('lasted')}
                    >
                      Lasted
                    </Button>
                  </Col>
                </Row>
              )}

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  <Card.Title>Add Product Category</Card.Title>
                  <Form onSubmit={handleAddProductCategory} className="mb-3">
                    <Form.Group as={Row}>
                      <Col md={10}>
                        <Form.Control
                          type="text"
                          placeholder="Text here..."
                          value={newProductCategory}
                          onChange={(e) => setNewProductCategory(e.target.value)}
                        />
                      </Col>
                      <Col md={2}>
                        <Button variant="dark" type="submit">
                          Add
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>

                  <Card.Subtitle className="mb-2 text-muted">Product Categories</Card.Subtitle>
                  {productCategories.length > 0 ? (
                    productCategories.map((category) => (
                      <Row key={category.id} className="mb-2 align-items-center">
                        <Col md={6}>{category.name}</Col>
                        <Col md={6} className="text-end">
                          <Button
                            variant="secondary"
                            className="me-2"
                            onClick={() => handleRemoveProductCategory(category.id)}
                          >
                            Remove
                          </Button>
                          <Button
                            variant="dark"
                            onClick={() => handleEditProductCategory(category.id)}
                          >
                            Edit
                          </Button>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <p>No product categories yet.</p>
                  )}

                  <Card.Title className="mt-4">Add Forum Category</Card.Title>
                  <Form onSubmit={handleAddForumCategory} className="mb-3">
                    <Form.Group as={Row}>
                      <Col md={10}>
                        <Form.Control
                          type="text"
                          placeholder="Text here..."
                          value={newForumCategory}
                          onChange={(e) => setNewForumCategory(e.target.value)}
                        />
                      </Col>
                      <Col md={2}>
                        <Button variant="dark" type="submit">
                          Add
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>

                  {forumCategories.length > 0 ? (
                    forumCategories.map((category) => (
                      <Row key={category.id} className="mb-2 align-items-center">
                        <Col md={6}>{category.name}</Col>
                        <Col md={6} className="text-end">
                          <Button
                            variant="secondary"
                            className="me-2"
                            onClick={() => handleRemoveForumCategory(category.id)}
                          >
                            Remove
                          </Button>
                          <Button
                            variant="dark"
                            onClick={() => handleEditForumCategory(category.id)}
                          >
                            Edit
                          </Button>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <p>No forum categories yet.</p>
                  )}
                </>
              )}

              {/* Purchases Tab */}
              {activeTab === 'purchases' && (
                <>
                  {paginateItems(filteredOrders).length > 0 ? (
                    paginateItems(filteredOrders).map((order) => (
                      <div key={order.id} className="mb-3">
                        <p>
                          <strong>Order #{order.id}</strong> - Cassette tape.png
                        </p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>User: {order.buyer?.username || 'Unknown'} [{order.buyer?.email || 'N/A'}]</p>
                        <p>Sum: ${order.totalPrice}</p>
                      </div>
                    ))
                  ) : (
                    <Alert variant="info">No orders found.</Alert>
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
                        Page {currentPage} of {totalPages(filteredOrders)}
                      </span>
                      <Button
                        variant="outline-dark"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages(filteredOrders)}
                        className="ms-2"
                      >
                        Next
                      </Button>
                    </Col>
                  </Row>
                </>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <>
                  {paginateItems(filteredProducts).length > 0 ? (
                    paginateItems(filteredProducts).map((product) => (
                      <div key={product.id} className="mb-3">
                        <p>
                          <strong>Product #{product.id}</strong> - {product.name}
                        </p>
                        <p>Description: {product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <Alert variant="info">No products found.</Alert>
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
                        Page {currentPage} of {totalPages(filteredProducts)}
                      </span>
                      <Button
                        variant="outline-dark"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages(filteredProducts)}
                        className="ms-2"
                      >
                        Next
                      </Button>
                    </Col>
                  </Row>
                </>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <>
                  {paginateItems(filteredUsers).length > 0 ? (
                    paginateItems(filteredUsers).map((user) => (
                      <div key={user.id} className="mb-3">
                        <p>
                          <strong>User #{user.id}</strong> - {user.username}
                        </p>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                        <p>Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <Alert variant="info">No users found.</Alert>
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
                        Page {currentPage} of {totalPages(filteredUsers)}
                      </span>
                      <Button
                        variant="outline-dark"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages(filteredUsers)}
                        className="ms-2"
                      >
                        Next
                      </Button>
                    </Col>
                  </Row>
                </>
              )}

              {/* Forum Topics Tab */}
              {activeTab === 'forum-topics' && (
                <>
                  {paginateItems(filteredForumTopics).length > 0 ? (
                    paginateItems(filteredForumTopics).map((topic) => (
                      <div key={topic.id} className="mb-3">
                        <p>
                          <strong>Topic #{topic.id}</strong> - {topic.title}
                        </p>
                        <p>Content: {topic.content.substring(0, 150)}...</p>
                        <p>Author: {topic.author?.username || 'Anonymous'}</p>
                        <p>Created: {new Date(topic.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <Alert variant="info">No forum topics found.</Alert>
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
                        Page {currentPage} of {totalPages(filteredForumTopics)}
                      </span>
                      <Button
                        variant="outline-dark"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages(filteredForumTopics)}
                        className="ms-2"
                      >
                        Next
                      </Button>
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