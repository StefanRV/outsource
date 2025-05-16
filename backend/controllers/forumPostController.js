const { ForumPost, User, PostVote } = require('../models');
const generateCRUDControllers = require('./generateCRUDControllers');

const forumPostController = {
  ...generateCRUDControllers(ForumPost),

  findByTopic: async (req, res) => {
    try {
      const posts = await ForumPost.findAll({
        where: { topicId: req.query.topicId },
        include: [
          { model: User, as: 'poster', attributes: ['id', 'username'] },
          {
            model: PostVote,
            as: 'postVotes',
            required: false, 
          },
        ],
        order: [['votes', 'DESC'], ['createdAt', 'ASC']], 
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  votePost: async (req, res) => {
    try {
      const { postId, voteType } = req.body; 
      const token = req.headers['x-access-token'];
      if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const secretKey = process.env.JWT_SECRET || 'your-secret-key';
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await require('jose').jwtVerify(token, secret);

      if (!payload || !payload.id) {
        return res.status(400).json({ error: 'User ID not found in token' });
      }

      const userId = payload.id;
      const post = await ForumPost.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (voteType !== 'up' && voteType !== 'down') {
        return res.status(400).json({ message: 'Invalid vote type' });
      }

      const existingVote = await PostVote.findOne({
        where: { userId, postId },
      });

      if (existingVote) {
        if (existingVote.voteType === voteType) {
          return res.status(400).json({ message: `You have already ${voteType}voted this post` });
        }

        const oldVoteType = existingVote.voteType;
        existingVote.voteType = voteType;
        await existingVote.save();

        if (oldVoteType === 'up' && voteType === 'down') {
          post.votes -= 2; 
        } else if (oldVoteType === 'down' && voteType === 'up') {
          post.votes += 2; 
        }
      } else {

        await PostVote.create({
          userId,
          postId,
          voteType,
        });


        if (voteType === 'up') {
          post.votes += 1;
        } else if (voteType === 'down') {
          post.votes -= 1;
        }
      }

      await post.save();
      res.status(200).json({ message: 'Vote recorded', votes: post.votes, userVote: voteType });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = forumPostController;