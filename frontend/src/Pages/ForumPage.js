import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const ForumHome = () => {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("newest");
  const [user, setUser] = useState(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/users/profile", {
          headers: { "x-access-token": token },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Error fetching user:", err);
          setError("Failed to fetch user profile.");
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [navigate]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" && e.newValue) {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/forumCategories"
        );
        setCategories(response.data);
      } catch (err) {
        setError("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    setTableMissing(false);
    try {
      let url = `http://localhost:5000/api/topics?sort=${sort}`;
      if (selectedCategories.length > 0) {
        url += `&categories=${selectedCategories.join(",")}`;
      }
      const response = await axios.get(url);
      if (response.data.tableMissing) {
        setTableMissing(true);
        setTopics([]);
      } else {
        setTopics(response.data);
      }
    } catch (err) {
      setError("Failed to fetch topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [selectedCategories, sort]);

  const handleCreateTable = async () => {
    try {
      await axios.post("http://localhost:5000/api/topics/create-table");
      setTableMissing(false);
      fetchTopics();
    } catch (err) {
      setError("Failed to create Topics table");
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCreateTopicRedirect = () => {
    if (user) {
      navigate("/create-topic");
    } else {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 3000);
    }
  };

  const handleTopicClick = (topicId) => {
    navigate(`/topic/${topicId}`);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="p-3 border-end">
          <h5 className="mb-3">CATEGORIES</h5>
          <div className="d-flex flex-wrap gap-2">
            <Button
              className={`rounded-pill category-btn ${
                selectedCategories.length === 0 ? "active" : ""
              }`}
              onClick={() => setSelectedCategories([])}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                className={`rounded-pill category-btn ${
                  selectedCategories.includes(category.id.toString()) ? "active" : ""
                }`}
                onClick={() => handleCategoryToggle(category.id.toString())}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Col>
        <Col md={10} className="p-3">
          <Row className="mb-4 align-items-center">
            <Col md={6}>
              <h2>Newest Questions</h2>
              <p className="text-muted">{topics.length} questions</p>
            </Col>
            <Col md={6} className="text-end">
              <Button
                className={`me-2 sort-btn ${sort === "newest" ? "active" : ""}`}
                onClick={() => setSort("newest")}
              >
                Newest
              </Button>
              <Button
                className={`me-2 sort-btn ${sort === "unanswered" ? "active" : ""}`}
                onClick={() => setSort("unanswered")}
              >
                Unanswered
              </Button>
              <Button
                className={user ? "btn-custom-success" : "btn-custom-secondary"}
                onClick={handleCreateTopicRedirect}
                disabled={!user}
              >
                Create New Topic
              </Button>
            </Col>
          </Row>
          {error && (
            <Alert variant="danger">
              {error}
              <Button className="btn-custom-link ms-2" onClick={fetchTopics}>
                Retry
              </Button>
            </Alert>
          )}
          {tableMissing && (
            <Alert variant="warning">
              The Topics table does not exist in the database.
              <Button className="btn-custom-link ms-2" onClick={handleCreateTable}>
                Create Topics Table
              </Button>
            </Alert>
          )}
          {showLoginAlert && (
            <Alert
              variant="warning"
              onClose={() => setShowLoginAlert(false)}
              dismissible
            >
              Please log in to create a topic. <Link to="/login" className="alert-link">Log in</Link>
            </Alert>
          )}
          {loading && (
            <Spinner animation="border" className="d-block mx-auto mt-5" />
          )}
          {!loading && !error && !tableMissing && topics.length === 0 && (
            <Alert variant="info">
              No topics yet.
              {user ? (
                <Button
                  as={Link}
                  to="/create-topic"
                  variant="link"
                  className="btn-custom-link ms-2"
                >
                  Create a Topic
                </Button>
              ) : (
                <span className="ms-2">
                  <Link to="/login" className="alert-link">Log in</Link> to create a topic.
                </span>
              )}
            </Alert>
          )}
          {!tableMissing &&
            topics.map((topic) => (
              <div
                key={topic.id}
                className="topic-card"
                onClick={() => handleTopicClick(topic.id)}
              >
                <Col xs={2} className="text-center">
                  <div>{topic.posts?.length || 0} answers</div>
                  <div>{topic.views || 0} views</div>
                </Col>
                <Col xs={10} className="col-xs-10">
                  <h5>
                    <Link
                      to={`/topic/${topic.id}`}
                      className="text-primary text-decoration-none"
                    >
                      {topic.title}
                    </Link>
                  </h5>
                  <p>{topic.content.substring(0, 150)}...</p>
                  <div className="d-flex flex-wrap">
                    {(topic.categories || []).map((category, index) => (
                      <span
                        key={index}
                        className={`badge me-1 mb-1 ${
                          selectedCategories.length > 0 &&
                          selectedCategories.includes(category.id.toString())
                            ? "bg-primary"
                            : "bg-light"
                        }`}
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted">
                    {topic.author?.username || "Anonymous"} asked{" "}
                    {new Date(topic.createdAt).toLocaleDateString()}
                  </p>
                </Col>
              </div>
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ForumHome;