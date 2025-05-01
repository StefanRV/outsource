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
      navigate("/login");
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-3 border-end">
          <h5 className="mb-3">CATEGORIES</h5>
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant={
                selectedCategories.length === 0 ? "primary" : "outline-primary"
              }
              onClick={() => setSelectedCategories([])}
              className="rounded-pill"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategories.includes(category.id.toString())
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => handleCategoryToggle(category.id.toString())}
                className="rounded-pill"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-3">
          <Row className="mb-4 align-items-center">
            <Col md={6}>
              <h2>Newest Questions</h2>
              <p className="text-muted">{topics.length} questions</p>
            </Col>
            <Col md={6} className="text-end">
              <Button
                variant={sort === "newest" ? "primary" : "outline-primary"}
                className="me-2"
                onClick={() => setSort("newest")}
              >
                Newest
              </Button>
              <Button
                variant={sort === "unanswered" ? "primary" : "outline-primary"}
                className="me-2"
                onClick={() => setSort("unanswered")}
              >
                Unanswered
              </Button>
              <Button variant="success" onClick={handleCreateTopicRedirect}>
                Create New Topic
              </Button>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger">
              {error}
              <Button variant="link" onClick={fetchTopics}>
                Retry
              </Button>
            </Alert>
          )}

          {tableMissing && (
            <Alert variant="warning">
              The Topics table does not exist in the database.
              <Button variant="link" onClick={handleCreateTable}>
                Create Topics Table
              </Button>
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
                  className="ms-2"
                >
                  Create a Topic
                </Button>
              ) : (
                <span className="ms-2">
                  <Link to="/login">Log in</Link> to create a topic.
                </span>
              )}
            </Alert>
          )}

          {!tableMissing &&
            topics.map((topic) => (
              <div key={topic.id} className="border-bottom pb-3 mb-3">
                <Row>
                  <Col xs={2} className="text-center">
                    <div>
                      <span
                        className={`fw-bold ${
                          topic.votes < 0 ? "text-danger" : "text-success"
                        }`}
                      >
                        {topic.votes || 0}
                      </span>{" "}
                      votes
                    </div>
                    <div>{topic.posts?.length || 0} answers</div>
                    <div>{topic.views || 0} views</div>
                  </Col>
                  <Col xs={10}>
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
                              ? "bg-primary text-white"
                              : "bg-light text-dark"
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
                </Row>
              </div>
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ForumHome;
