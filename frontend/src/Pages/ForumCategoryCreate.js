import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CategoryCreate = () => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/users/profile", {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.data.role === "admin") {
          setIsAdmin(true);
        } else {
          setError("You do not have permission to access this page.");
          setTimeout(() => navigate("/"), 2000);
        }
      })
      .catch((err) => {
        setError("Failed to verify user permissions.");
        setTimeout(() => navigate("/login"), 2000);
      });
  }, [navigate]);

  const handleCreateCategory = async () => {
    if (!categoryName) {
      setError("Category name is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/forumCategories",
        { name: categoryName },
        { headers: { "x-access-token": token } }
      );
      setSuccess(
        "Category created successfully! It can now be used to tag topics."
      );
      setCategoryName("");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
      setSuccess(null);
    }
  };

  if (!isAdmin && !error) {
    return null;
  }

  return (
    <Container className="mt-5">
      <h2>Create New Forum Category</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleCreateCategory}>
          Create Category
        </Button>
      </Form>
    </Container>
  );
};

export default CategoryCreate;
