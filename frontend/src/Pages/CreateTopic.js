import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTopic = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryIds, setCategoryIds] = useState([]); // Array for multiple category IDs
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to create a topic.");
      navigate("/login");
      return;
    }

    if (categoryIds.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/topics",
        { title, content, categoryIds },
        { headers: { "x-access-token": token } }
      );
      setSuccess("Topic created successfully!");
      setTimeout(() => navigate("/forum"), 500);
    } catch (err) {
      setError(
        "Failed to create topic: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <Container className="my-4">
      <h2>Create a New Topic</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categories (Click to select)</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  categoryIds.includes(category.id.toString())
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
        </Form.Group>
        <Button type="submit" variant="primary">
          Create Topic
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTopic;
