const {
  User,
  Product,
  Favorite,
  Category,
  FavoriteUser,
} = require("../models");
const generateCRUDControllers = require("./generateCRUDControllers");
const userCRUDControllers = generateCRUDControllers(User);
const { jwtVerify } = require("jose");
const bcrypt = require("bcrypt");
const userController = {
  ...userCRUDControllers,

  findUsersByUsername: async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          username: req.params.username,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  allAccess: (req, res) => {
    res.status(200).send("Public Content.");
  },

  userBoard: (req, res) => {
    res.status(200).send("User Content.");
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ["id", "username", "email", "role", "balance", "createdAt"],
        include: [
          {
            model: Product,
            as: "products",
            include: [
              {
                model: Category,
                as: "category",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateUser: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodeToken = (token) => {
        try {
          const secretKey = process.env.JWT_SECRET_KEY || "your-secret-key";
          const { payload } = jwtVerify(token, Buffer.from(secretKey, "utf-8"));
          return payload;
        } catch (error) {
          console.error("Error while decoding token:", error.message);
          return null;
        }
      };

      const extractIdFromToken = (token) => {
        const decoded = decodeToken(token);
        if (decoded && decoded.id) {
          return decoded.id;
        } else {
          console.error("Unable to extract ID from token");
          return null;
        }
      };

      const userId = extractIdFromToken(token);

      if (!userId) {
        return res.status(400).json({ error: "User ID not found in token" });
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      const data = { ...req.body, userId };

      await User.update(data, { where: { id: req.params.id } });

      const updatedResource = await User.findByPk(req.params.id);

      res.json(updatedResource);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const decodeToken = async (token) => {
        try {
          const secretKey = process.env.JWT_SECRET_KEY || "your-secret-key";
          const { payload } = await jwtVerify(
            token,
            Buffer.from(secretKey, "utf-8")
          );
          return payload;
        } catch (error) {
          console.error("Error while decoding token:", error.message);
          return null;
        }
      };

      const decoded = await decodeToken(token);
      if (!decoded || !decoded.id || decoded.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Unauthorized: Admin access required" });
      }

      const userId = req.params.id;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await User.destroy({ where: { id: userId } });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  rechargeBalance: async (req, res) => {
    const { amount } = req.body;
    console.log("Received amount:", amount, typeof amount);
    const validAmounts = [5, 10, 15, 20, 25, 50].map((val) =>
      parseFloat(val.toFixed(2))
    );
    const amountNumber = parseFloat(amount.toFixed(2));
    if (!validAmounts.includes(amountNumber)) {
      return res.status(400).json({ message: "Неверная сумма для пополнения" });
    }

    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      const secret = new TextEncoder().encode(secretKey);
      console.log("Using secretKey:", secretKey);
      const { payload } = await jwtVerify(token, secret);

      if (!payload || !payload.id) {
        return res.status(400).json({ error: "User ID not found in token" });
      }

      const userId = payload.id;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      user.balance += amountNumber;
      await user.save();

      return res.status(200).json({
        message: `Баланс пополнен на ${amountNumber}€`,
        balance: user.balance,
      });
    } catch (error) {
      console.error("Ошибка при пополнении баланса:", error);
      res.status(500).json({
        message: "Ошибка при пополнении баланса",
        error: error.message,
      });
    }
  },

  getUserProfile: async (req, res) => {
    try {
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

      const user = await User.findByPk(userId, {
        attributes: ["id", "username", "email", "role", "balance", "createdAt"],
        include: [
          {
            model: Product,
            as: "products",
            include: [
              {
                model: Category,
                as: "category",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  addToFavorites: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(token, secret);

      if (!payload || !payload.id) {
        return res.status(400).json({ error: "User ID not found in token" });
      }

      const userId = payload.id;
      const { productId } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Продукт не найден" });
      }

      const existingFavorite = await Favorite.findOne({
        where: { userId, productId },
      });

      if (existingFavorite) {
        return res.status(400).json({ message: "Продукт уже в избранном" });
      }

      await Favorite.create({ userId, productId });

      res.status(201).json({ message: "Продукт добавлен в избранное" });
    } catch (error) {
      console.error("Ошибка при добавлении в избранное:", error);
      res.status(500).json({
        message: "Ошибка при добавлении в избранное",
        error: error.message,
      });
    }
  },

  removeFromFavorites: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(token, secret);

      if (!payload || !payload.id) {
        return res.status(400).json({ error: "User ID not found in token" });
      }

      const userId = payload.id;
      const { productId } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Продукт не найден" });
      }

      const favorite = await Favorite.findOne({
        where: { userId, productId },
      });

      if (!favorite) {
        return res
          .status(400)
          .json({ message: "Продукт не находится в избранном" });
      }

      await favorite.destroy();

      res.status(200).json({ message: "Продукт удален из избранного" });
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error);
      res.status(500).json({
        message: "Ошибка при удалении из избранного",
        error: error.message,
      });
    }
  },

  getFavorites: async (req, res) => {
    try {
      console.log("getFavorites called");
      const token = req.headers["x-access-token"];
      if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "Not authorized" });
      }

      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      console.log("Using secretKey:", secretKey);
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(token, secret);
      console.log("Token payload:", payload);

      if (!payload || !payload.id) {
        console.log("User ID not found in token");
        return res.status(400).json({ error: "User ID not found in token" });
      }

      const userId = payload.id;
      console.log("User ID:", userId);

      const user = await User.findByPk(userId);
      if (!user) {
        console.log("User not found for ID:", userId);
        return res.status(404).json({ error: "User not found" });
      }

      console.log("User found:", user);

      const favorites = await Favorite.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            as: "product",
            include: [
              { model: Category, as: "category", attributes: ["id", "name"] },
              {
                model: User,
                as: "seller",
                attributes: ["id", "username", "email"],
              },
            ],
          },
        ],
      });

      console.log("Favorites retrieved:", favorites);
      res.status(200).json(favorites);
    } catch (error) {
      console.error("Error with getting favorites:", error);
      res.status(500).json({
        message: "Error with getting favorites",
        error: error.message,
      });
    }
  },

  addUserToFavorites: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(token, secret);

      if (!payload || !payload.id) {
        return res.status(400).json({ error: "User ID not found in token" });
      }

      const userId = payload.id;
      const { favUserId } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const favUser = await User.findByPk(favUserId);
      if (!favUser) {
        return res
          .status(404)
          .json({ message: "Избранный пользователь не найден" });
      }

      if (userId === favUserId) {
        return res
          .status(400)
          .json({ message: "Нельзя добавить себя в избранное" });
      }

      const existingFavorite = await FavoriteUser.findOne({
        where: { userId, favUserId },
      });

      if (existingFavorite) {
        return res
          .status(400)
          .json({ message: "Пользователь уже в избранном" });
      }

      await FavoriteUser.create({ userId, favUserId });

      res.status(201).json({ message: "Пользователь добавлен в избранное" });
    } catch (error) {
      console.error("Ошибка при добавлении пользователя в избранное:", error);
      res.status(500).json({
        message: "Ошибка при добавлении в избранное",
        error: error.message,
      });
    }
  },

  removeUserFromFavorites: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(token, secret);

      if (!payload || !payload.id) {
        return res.status(400).json({ error: "User ID not found in token" });
      }

      const userId = payload.id;
      const { favUserId } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const favUser = await User.findByPk(favUserId);
      if (!favUser) {
        return res
          .status(404)
          .json({ message: "Избранный пользователь не найден" });
      }

      const favorite = await FavoriteUser.findOne({
        where: { userId, favUserId },
      });

      if (!favorite) {
        return res
          .status(400)
          .json({ message: "Пользователь не находится в избранном" });
      }

      await favorite.destroy();

      res.status(200).json({ message: "Пользователь удален из избранного" });
    } catch (error) {
      console.error("Ошибка при удалении пользователя из избранного:", error);
      res.status(500).json({
        message: "Ошибка при удалении из избранного",
        error: error.message,
      });
    }
  },

  getFavoriteUsers: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const secretKey = process.env.JWT_SECRET || "your-secret-key";
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(token, secret);

      if (!payload || !payload.id) {
        return res.status(400).json({ error: "User ID not found in token" });
      }

      const userId = payload.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const favoriteUsers = await FavoriteUser.findAll({
        where: { userId },
        include: [
          {
            model: User,
            as: "favUser",
            attributes: ["id", "username", "email", "createdAt"],
            include: [
              {
                model: Product,
                as: "products",
                attributes: ["id"],
              },
            ],
          },
        ],
      });

      res.status(200).json(favoriteUsers);
    } catch (error) {
      console.error("Error with getting favorite users:", error);
      res.status(500).json({
        message: "Error with getting favorite users",
        error: error.message,
      });
    }
  },
};

module.exports = userController;
