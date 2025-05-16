const express = require("express");
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chatRoutes = require("./routes/chatRoutes");
const contactRoutes = require("./routes/contactRoutes");
const forumCategoryRoutes = require("./routes/forumCategoryRoutes");
const topicRoutes = require("./routes/topicRoutes");
const forumPostRoutes = require("./routes/forumPostRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const sequelize = require("./config/db");
const app = express();
const server = http.createServer(app);
const path = require("path");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/forumCategories", forumCategoryRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/posts", forumPostRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000;
sequelize
  .sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

module.exports = app;
