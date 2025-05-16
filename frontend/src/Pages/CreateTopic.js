import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/components/CreateTopic.module.scss";

const CreateTopic = () => {
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: "",
    categoryIds: [],
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
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
          setError("Failed to verify user.");
          setUser(null);
          navigate("/login");
        });
    } else {
      setError("Please log in to create a topic.");
      navigate("/login");
    }

    axios
      .get("http://localhost:5000/api/forumCategories")
      .then((res) => setCategories(res.data))
      .catch((err) => setError("Failed to fetch categories"));
  }, [navigate]);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (
      !newTopic.title ||
      !newTopic.content ||
      newTopic.categoryIds.length === 0
    ) {
      setError("Title, content, and at least one category are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/topics",
        newTopic,
        { headers: { "x-access-token": token } }
      );
      setSuccess("Topic created successfully!");
      setTimeout(() => navigate(`/topic/${response.data.id}`), 100);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create topic");
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setNewTopic((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleTitleChange = (e) => {
    const value = e.target.value.slice(0, 200);
    setNewTopic({ ...newTopic, title: value });
  };

  const handleContentChange = (e) => {
    const value = e.target.value.slice(0, 1000);
    setNewTopic({ ...newTopic, content: value });
  };

  return (
    <Container className={`${styles.container} mt-5`}>
      <h2>Create a New Topic</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <div className={styles.rulesList}>
        <h4>Forum Rules</h4>
        <ol>
          <li>
            Relevance: Ensure that the topic you are posting is relevant to the
            category or section of the forum...
          </li>
          {/* Other rules */}
        </ol>
      </div>
      <Form onSubmit={handleCreateTopic}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={newTopic.title}
            onChange={handleTitleChange}
            maxLength={200}
            placeholder="Enter your question title"
          />
          <div className={styles.charCounter}>{newTopic.title.length}/200</div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categories (Click to select)</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                className={`${styles.btnOutline} rounded-pill ${
                  newTopic.categoryIds.includes(category.id.toString())
                    ? styles.btnPrimary
                    : ""
                }`}
                onClick={() => handleCategoryToggle(category.id.toString())}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={newTopic.content}
            onChange={handleContentChange}
            maxLength={1000}
            placeholder="Write your question here..."
          />
          <div className={styles.charCounter}>
            {newTopic.content.length}/1000
          </div>
        </Form.Group>
        <Button type="submit" className={styles.btnPrimary}>
          Submit Topic
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTopic;
