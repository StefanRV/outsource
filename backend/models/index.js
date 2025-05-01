const User = require("./user");
const Product = require("./product");
const Category = require("./category");
const Order = require("./order");
const OrderItem = require("./orderItem");
const Message = require("./message");
const Chat = require("./chat");
const Favorite = require("./favorite");
const FavoriteUser = require("./favoriteUsers");
const ForumCategory = require("./forumCategory");
const Topic = require("./topic");
const ForumPost = require("./forumPost");
const PostVote = require("./postVote.js");

// User relationships
User.hasMany(Product, { foreignKey: "userId", as: "products" });
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
User.hasMany(Favorite, { foreignKey: "userId", as: "favorites" });
User.hasMany(Message, { foreignKey: "senderId", as: "messages" });
User.hasMany(Chat, { foreignKey: "userId", as: "chats" });
User.hasMany(Chat, { foreignKey: "user2Id", as: "chatsAsUser2" });
User.hasMany(FavoriteUser, { foreignKey: "userId", as: "favorite" });
User.hasMany(FavoriteUser, { foreignKey: "favUserId", as: "favoritedBy" });
User.hasMany(Topic, { foreignKey: "userId", as: "topics" });
User.hasMany(ForumPost, { foreignKey: "userId", as: "forumPosts" });
User.hasMany(PostVote, { foreignKey: "userId", as: "postVotes" });

// ForumCategory relationships
ForumCategory.belongsToMany(Topic, {
  through: "TopicCategories",
  as: "topics",
  foreignKey: "categoryId",
});

// Topic relationships
Topic.belongsToMany(ForumCategory, {
  through: "TopicCategories",
  as: "categories",
  foreignKey: "topicId",
});
Topic.belongsTo(User, { as: "author", foreignKey: "userId" });
Topic.hasMany(ForumPost, { as: "posts", foreignKey: "topicId" });

// ForumPost relationships
ForumPost.belongsTo(Topic, { foreignKey: "topicId" });
ForumPost.belongsTo(User, { as: "poster", foreignKey: "userId" });
ForumPost.hasMany(PostVote, { foreignKey: "postId", as: "postVotes" });

// PostVote relationships
PostVote.belongsTo(User, { foreignKey: "userId" });
PostVote.belongsTo(ForumPost, { foreignKey: "postId" });

// Category relationships
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

// Product relationships
Product.belongsTo(User, { as: "seller", foreignKey: "userId" });
Product.belongsTo(Category, { as: "category", foreignKey: "categoryId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });
Product.hasMany(Favorite, { foreignKey: "productId", as: "favorites" });

// Order relationships
Order.belongsTo(User, { as: "buyer", foreignKey: "userId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });

// OrderItem relationships
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

// Message relationships
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Message.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

// Chat relationships
Chat.belongsTo(User, { as: "user1", foreignKey: "userId" });
Chat.belongsTo(User, { as: "user2", foreignKey: "user2Id" });
Chat.hasMany(Message, { foreignKey: "chatId", as: "messages" });

// Favorite relationships
Favorite.belongsTo(Product, { foreignKey: "productId", as: "product" });
Favorite.belongsTo(User, { foreignKey: "userId", as: "favoriter" });

// FavoriteUser relationships
FavoriteUser.belongsTo(User, { foreignKey: "userId", as: "user" });
FavoriteUser.belongsTo(User, { foreignKey: "favUserId", as: "favUser" });

module.exports = {
  User,
  Topic,
  ForumCategory,
  ForumPost,
  Product,
  Category,
  Order,
  OrderItem,
  Message,
  Chat,
  Favorite,
  FavoriteUser,
  PostVote,
};
