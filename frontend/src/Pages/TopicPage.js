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
        });
    } else {
      setUser(null);
    }

    axios
      .get("http://localhost:5000/api/forumCategories")
      .then((res) => setCategories(res.data))
      .catch((err) => setError("Failed to fetch categories"));
  }, [navigate]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:5000/api/topics/${id}`, {
          headers: token ? { "x-access-token": token } : {},
        })
        .then((res) => {
          setTopic(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch topic");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

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
      const response = await axios.post(
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
    <Container className="mt-5">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {id ? (
        <>
          <h2>{topic?.title}</h2>
          <Row className="mb-4">
            <Col xs={2} className="text-center">
              <div>
                <span
                  className={`fw-bold ${
                    topic?.votes < 0 ? "text-danger" : "text-success"
                  }`}
                >
                  {topic?.votes || 0}
                </span>{" "}
                votes
              </div>
              <div>{topic?.posts?.length || 0} answers</div>
              <div>{topic?.views || 0} views</div>
            </Col>
            <Col xs={10}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {topic?.content}
              </ReactMarkdown>
              <div className="d-flex flex-wrap mb-2">
                {(topic?.categories || []).map((category, index) => (
                  <span key={index} className="badge bg-light text-dark me-1">
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
            <div className="border-bottom pb-3 mb-3 border border-success bg-light p-3 rounded">
              <div className="text-success mb-2">
                <strong>
                  Best Answer (Highest Votes: {finalBestAnswer.votes})
                </strong>
              </div>
              <Row>
                <Col xs={2} className="text-center">
                  <div>
                    <span
                      className={`fw-bold ${
                        finalBestAnswer.votes < 0
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {finalBestAnswer.votes}
                    </span>{" "}
                    votes
                  </div>
                  {user ? (
                    <>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleVote(finalBestAnswer.id, "up")}
                        disabled={(finalBestAnswer.postVotes || []).some(
                          (vote) =>
                            vote.userId === user?.id && vote.voteType === "up"
                        )}
                      >
                        Upvote
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="mt-2"
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
            <div key={post.id} className="border-bottom pb-3 mb-3">
              <Row>
                <Col xs={2} className="text-center">
                  <div>
                    <span
                      className={`fw-bold ${
                        post.votes < 0 ? "text-danger" : "text-success"
                      }`}
                    >
                      {post.votes}
                    </span>{" "}
                    votes
                  </div>
                  {user ? (
                    <>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleVote(post.id, "up")}
                        disabled={(post.postVotes || []).some(
                          (vote) =>
                            vote.userId === user?.id && vote.voteType === "up"
                        )}
                      >
                        Upvote
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="mt-2"
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
              <Form.Group className="mb-3">
                <Form.Label>Your Answer (Markdown supported)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Write your answer here..."
                />
              </Form.Group>
              <Button variant="primary" onClick={handleCreatePost}>
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
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTopic.title}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, title: e.target.value })
                }
                placeholder="Enter your question title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categories (Click to select)</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      newTopic.categoryIds.includes(category.id.toString())
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
            <Form.Group className="mb-3">
              <Form.Label>Content (Markdown supported)</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={newTopic.content}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, content: e.target.value })
                }
                placeholder="Write your question here..."
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateTopic}>
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
