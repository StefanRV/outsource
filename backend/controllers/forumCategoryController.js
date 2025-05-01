const { ForumCategory } = require('../models');
const generateCRUDControllers = require('./generateCRUDControllers');

const forumCategoryController = {
  ...generateCRUDControllers(ForumCategory),
};

module.exports = forumCategoryController;