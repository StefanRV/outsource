import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  Button,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TopicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [topic, setTopic] = useState(null);
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: "",
    categoryIds: [],
  });
  const [categories, setCategories] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      let userData = null;

      if (token) {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/users/profile",
            {
              headers: { "x-access-token": token },
            }
          );
          userData = res.data;
          setUser(userData);
        } catch (err) {
          setError("Failed to verify user.");
          setUser(null);
        }
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/forumCategories"
        );
        setCategories(res.data);
      } catch (err) {
        setError("Failed to fetch categories");
      }

      if (id) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/topics/${id}`,
            {
              headers: token ? { "x-access-token": token } : {},
            }
          );
          setTopic(res.data);

          if (token) {
            try {
              const response = await axios.post(
                `http://localhost:5000/api/topics/${id}/view`,
                {},
                { headers: { "x-access-token": token } }
              );
              console.log("View registration response:", response.data);
              const viewedKey = `viewed_${id}_${userData?.id || "anonymous"}`;
              localStorage.setItem(viewedKey, "true");
            } catch (err) {
              console.error("Failed to register view:", err);
              setError("Failed to register view: " + err.message);
            }
          }
        } catch (err) {
          setError("Failed to fetch topic: " + err.message);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (success) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        setAlertVisible(false);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        setAlertVisible(false);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreateTopic = async () => {
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
      setNewTopic({ title: "", content: "", categoryIds: [] });
      navigate(`/topic/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create topic");
    }
  };

  const handleCreatePost = async () => {
    if (!newPost) {
      setError("Post content is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/posts",
        { content: newPost, topicId: id, userId: user.id },
        { headers: { "x-access-token": token } }
      );
      setNewPost("");
      setSuccess("Post added successfully!");
      const response = await axios.get(
        `http://localhost:5000/api/topics/${id}`,
        {
          headers: { "x-access-token": token },
        }
      );
      setTopic(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add post");
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/posts/vote",
        { postId, voteType },
        { headers: { "x-access-token": token } }
      );
      const updatedTopic = await axios.get(
        `http://localhost:5000/api/topics/${id}`,
        {
          headers: { "x-access-token": token },
        }
      );
      setTopic(updatedTopic.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to vote on post");
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

  const handlePostChange = (e) => {
    const value = e.target.value.slice(0, 1000);
    setNewPost(value);
  };

  const bestAnswer =
    topic?.posts?.length > 0
      ? topic.posts.reduce((max, post) => {
          return max === null || post.votes > max.votes ? post : max;
        }, null)
      : null;

  const finalBestAnswer =
    bestAnswer && bestAnswer.votes > 0 ? bestAnswer : null;

  const otherPosts = finalBestAnswer
    ? topic?.posts?.filter((post) => post.id !== finalBestAnswer.id) || []
    : topic?.posts || [];

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  return (
    <Container className="mt-5 p-4">
      {id && (
        <Link to="/forum" className="back-btn">
          Back
        </Link>
      )}
      <div className="alert-container">
        {alertVisible && error && (
          <Alert
            variant="danger"
            className={error ? "" : "fade-out"}
            style={{ marginBottom: "0" }}
          >
            {error}
          </Alert>
        )}
        {alertVisible && success && (
          <Alert
            variant="success"
            className={success ? "" : "fade-out"}
            style={{ marginBottom: "0" }}
          >
            {success}
          </Alert>
        )}
      </div>

      {id ? (
        <>
          <h2>{topic?.title}</h2>
          <Row className="mb-4">
            <Col xs={2} className="text-center">
              <div>{topic?.posts?.length || 0} answers</div>
              <div>{topic?.views || 0} views</div>
            </Col>
            <Col xs={10} className="topic-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {topic?.content}
              </ReactMarkdown>
              <div className="d-flex flex-wrap mb-2">
                {(topic?.categories || []).map((category, index) => (
                  <span key={index} className="badge bg-light me-1">
                    {category.name}
                  </span>
                ))}
              </div>
              <p className="text-muted">
                Posted by {topic?.author?.username || "Anonymous"} on{" "}
                {new Date(topic?.createdAt).toLocaleDateString()}
              </p>
            </Col>
          </Row>

          <h4>Answers</h4>
          {finalBestAnswer && (
            <div className="best-answer">
              <div className="best-label">Best Answer</div>
              <Row>
                <Col xs={2} className="text-center">
                  <div>
                    <span
                      className={`fw-bold ${
                        finalBestAnswer.votes < 0
                          ? "text-danger"
                          : finalBestAnswer.votes > 0
                          ? "text-success"
                          : ""
                      }`}
                    >
                      {finalBestAnswer.votes}
                    </span>{" "}
                    votes
                  </div>
                  {user ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 btn-custom-outline"
                        onClick={() => handleVote(finalBestAnswer.id, "up")}
                        disabled={(finalBestAnswer.postVotes || []).some(
                          (vote) =>
                            vote.userId === user?.id && vote.voteType === "up"
                        )}
                      >
                        Upvote
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 btn-custom-outline"
                        onClick={() => handleVote(finalBestAnswer.id, "down")}
                        disabled={(finalBestAnswer.postVotes || []).some(
                          (vote) =>
                            vote.userId === user?.id && vote.voteType === "down"
                        )}
                      >
                        Downvote
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted mt-2">
                      <Link to="/login">Log in</Link> to vote.
                    </p>
                  )}
                </Col>
                <Col xs={10}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {finalBestAnswer.content}
                  </ReactMarkdown>
                  <p className="text-muted">
                    Posted by {finalBestAnswer.poster?.username || "Anonymous"}{" "}
                    on{" "}
                    {new Date(finalBestAnswer.createdAt).toLocaleDateString()}
                  </p>
                </Col>
              </Row>
            </div>
          )}

          {otherPosts.map((post) => (
            <div key={post.id} className="post-item">
              <Row>
                <Col xs={2} className="text-center">
                  <div>
                    <span
                      className={`fw-bold ${
                        post.votes < 0
                          ? "text-danger"
                          : post.votes > 0
                          ? "text-success"
                          : ""
                      }`}
                    >
                      {post.votes}
                    </span>{" "}
                    votes
                  </div>
                  {user ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 btn-custom-outline"
                        onClick={() => handleVote(post.id, "up")}
                        disabled={(post.postVotes || []).some(
                          (vote) =>
                            vote.userId === user?.id && vote.voteType === "up"
                        )}
                      >
                        Upvote
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 btn-custom-outline"
                        onClick={() => handleVote(post.id, "down")}
                        disabled={(post.postVotes || []).some(
                          (vote) =>
                            vote.userId === user?.id && vote.voteType === "down"
                        )}
                      >
                        Downvote
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted mt-2">
                      <Link to="/login">Log in</Link> to vote.
                    </p>
                  )}
                </Col>
                <Col xs={10}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                  </ReactMarkdown>
                  <p className="text-muted">
                    Posted by {post.poster?.username || "Anonymous"} on{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </Col>
              </Row>
            </div>
          ))}

          <h5>Add Your Answer</h5>
          {user ? (
            <Form>
              <Form.Group className="form-group">
                <Form.Label>Your Answer (Markdown supported)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={newPost}
                  onChange={handlePostChange}
                  maxLength={1000}
                  placeholder="Write your answer here..."
                />
                <div className="char-counter">{newPost.length}/1000</div>
              </Form.Group>
              <Button
                variant="primary"
                className="btn-custom-primary"
                onClick={handleCreatePost}
              >
                Submit Answer
              </Button>
            </Form>
          ) : (
            <Alert variant="info">
              Please <Link to="/login">log in</Link> to add an answer.
            </Alert>
          )}
        </>
      ) : user ? (
        <>
          <h2>Create a New Topic</h2>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateTopic();
            }}
          >
            <Form.Group className="form-group">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTopic.title}
                onChange={handleTitleChange}
                maxLength={200}
                placeholder="Enter your question title"
              />
              <div className="char-counter">{newTopic.title.length}/200</div>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Categories (Click to select)</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    className={`rounded-pill ${
                      newTopic.categoryIds.includes(category.id.toString())
                        ? "btn-custom-primary"
                        : "btn-custom-outline"
                    }`}
                    onClick={() => handleCategoryToggle(category.id.toString())}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Content (Markdown supported)</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={newTopic.content}
                onChange={handleContentChange}
                maxLength={1000}
                placeholder="Write your question here..."
              />
              <div className="char-counter">{newTopic.content.length}/1000</div>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="btn-custom-primary create-topic-btn"
            >
              Create Topic
            </Button>
          </Form>
        </>
      ) : (
        <Alert variant="info">
          Please <Link to="/login">log in</Link> to create a new topic.
        </Alert>
      )}
    </Container>
  );
};

export default TopicPage;
