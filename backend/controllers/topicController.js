const { Op } = require("sequelize");
const sequelize = require("../config/db");
const { Topic, ForumCategory, User, ForumPost } = require("../models");

const topicController = {
  ...require("./generateCRUDControllers")(Topic),

  findAllWithFilters: async (req, res) => {
    try {
      const { categories, sort } = req.query;
      const where = {};
      const order = [];

      console.log("Query params:", { categories, sort });

      if (categories) {
        const categoryIds = categories
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
        if (categoryIds.length === 0) {
          return res
            .status(400)
            .json({ error: "No valid category IDs provided" });
        }
        where[Op.and] = sequelize.literal(
          `EXISTS (
            SELECT 1
            FROM TopicCategories tc
            WHERE tc.topicId = \`Topic\`.\`id\`
            AND tc.categoryId IN (${categoryIds.join(",")})
          )`
        );
      }

      switch (sort) {
        case "newest":
          order.push(["createdAt", "DESC"]);
          break;
        case "unanswered":
          where["$posts.id$"] = { [Op.is]: null };
          break;
        default:
          order.push(["createdAt", "DESC"]);
      }

      console.log("Sequelize query options:", { where, order });

      const topics = await Topic.findAll({
        where,
        include: [
          { model: User, as: "author", attributes: ["id", "username"] },
          { model: ForumCategory, as: "categories" },
          { model: ForumPost, as: "posts", required: false },
        ],
        order,
      });

      console.log("Fetched topics:", topics);

      res.status(200).json(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      if (
        error.name === "SequelizeDatabaseError" &&
        error.parent &&
        error.parent.errno === 1146
      ) {
        return res
          .status(200)
          .json({ tableMissing: true, message: "Topics table does not exist" });
      }
      res.status(500).json({ error: error.message });
    }
  },

  getTopicById: async (req, res) => {
    try {
      const topic = await Topic.findByPk(req.params.id, {
        include: [
          { model: User, as: "author", attributes: ["id", "username"] },
          { model: ForumCategory, as: "categories" },
          {
            model: ForumPost,
            as: "posts",
            include: [
              { model: User, as: "poster", attributes: ["id", "username"] },
            ],
          },
        ],
      });
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      // topic.views = (topic.views || 0) + 1;
      // await topic.save();

      res.status(200).json(topic);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createTopic: async (req, res) => {
    try {
      const { title, content, categoryIds } = req.body;
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await require("jose").jwtVerify(token, secret);

      if (!payload || !payload.id) {
        return res.status(400).json({ error: "User ID not found in token" });
      }

      const userId = payload.id;

      const topic = await Topic.create({
        title,
        content,
        userId,
      });

      if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
        await topic.addCategories(categoryIds);
      }

      const createdTopic = await Topic.findByPk(topic.id, {
        include: [
          { model: User, as: "author", attributes: ["id", "username"] },
          { model: ForumCategory, as: "categories" },
        ],
      });

      res.status(201).json(createdTopic);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  registerView: async (req, res) => {
    try {
      const topicId = req.params.id;
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await require("jose").jwtVerify(token, secret);

      if (!payload || !payload.id) {
        return res.status(400).json({ error: "User ID not found in token" });
      }

      const userId = payload.id;

      const topic = await Topic.findByPk(topicId);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      const viewedKey = `viewed_${topicId}_${userId}`;
      const hasAlreadyViewed = await sequelize.models.View?.findOne({
        where: { topicId, userId },
      });

      if (hasAlreadyViewed) {
        return res.status(200).json({ message: "View already registered" });
      }

      topic.views = (topic.views || 0) + 1;
      await topic.save();

      res.status(200).json({ message: "View registered successfully" });
    } catch (error) {
      console.error("Error registering view:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = topicController;
