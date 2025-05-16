import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch product and categories
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to edit the product');
        navigate('/login');
        return;
      }

      try {
        // Fetch product
        const productResponse = await axios.get(`http://localhost:5000/api/products/${id}`, {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        });
        setFormData({
          name: productResponse.data.name,
          description: productResponse.data.description,
          price: productResponse.data.price.toString(),
          categoryId: productResponse.data.categoryId.toString(),
        });

        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:5000/api/categories', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product or categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to update the product');
      navigate('/login');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', parseFloat(formData.price));
    form.append('categoryId', parseInt(formData.categoryId));
    if (imageFile) {
      form.append('image', imageFile);
    }

    try {
      console.log('Token:', token); // Debug token
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        form,
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Product updated successfully!');
      setTimeout(() => navigate('/profile'), 2000); // Redirect to profile after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      console.error('Error updating product:', err);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error && !formData.name) return <Alert variant="danger" className="text-center mt-5">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2>Edit Product</h2>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Price (€)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image File</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Button variant="primary" type="submit">
          Update Product
        </Button>
      </Form>
    </Container>
  );
}