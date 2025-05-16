import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/chats", {
          headers: { "x-access-token": token },
        });
        const sortedChats = response.data.sort(
          (a, b) =>
            new Date(b.latestMessageTime || b.createdAt) -
            new Date(a.latestMessageTime || a.createdAt)
        );
        setChats(sortedChats);

        if (sortedChats.length > 0) {
          loadMessages(sortedChats[0]);
        }
      } catch (err) {
        console.error("Error while getting chats", err);
      } finally {
        setLoadingChats(false);
      }
    };

    if (token) fetchChats();
  }, [token]);

  const loadMessages = async (chat) => {
    setActiveChat(chat);
    setLoadingMessages(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chats/${chat.id}/messages`,
        {
          headers: { "x-access-token": token },
        }
      );
      setMessages(response.data);
    } catch (err) {
      console.error("Error while getting messages", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const recipientId =
      userId === activeChat.userId ? activeChat.user2Id : activeChat.userId;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/messages",
        {
          recipientId,
          content: newMessage,
        },
        {
          headers: { "x-access-token": token },
        }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) =>
          chat.id === activeChat.id
            ? { ...chat, latestMessageTime: response.data.createdAt }
            : chat
        );
        return updatedChats.sort(
          (a, b) =>
            new Date(b.latestMessageTime || b.createdAt) -
            new Date(a.latestMessageTime || a.createdAt)
        );
      });
    } catch (err) {
      console.error("Error during message delivery", err);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Container className="my-4 chat-container">
      <Row>
        <Col md={4} className="chat-contacts">
          <h5>Контакты</h5>
          {loadingChats ? (
            <Spinner animation="border" />
          ) : (
            <ListGroup>
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <ListGroup.Item
                    key={chat.id}
                    action
                    active={activeChat?.id === chat.id}
                    onClick={() => loadMessages(chat)}
                  >
                    {`Chat with ${chat.chatUsername || "Unknown User"}`}
                  </ListGroup.Item>
                ))
              ) : (
                <div>Чаты не найдены</div>
              )}
            </ListGroup>
          )}
        </Col>

        <Col md={8} className="chat-messages">
          <h5>Сообщения</h5>
          <div className="messages-container">
            {loadingMessages ? (
              <Spinner animation="border" />
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.senderId === userId ? "sent" : "received"
                  }`}
                >
                  <strong>
                    {msg.senderId === userId ? "Вы" : "Собеседник"}
                  </strong>
                  {msg.content}
                </div>
              ))
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {activeChat && (
            <Form
              className="message-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Form.Group className="flex-grow-1">
                <Form.Control
                  type="text"
                  placeholder="Type message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </Form.Group>
              <Button type="submit">Send</Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
