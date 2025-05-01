const { jwtVerify } = require('jose');
const { User } = require('../models');

const getTokenFromHeaders = (req) => {
  return req.headers['x-access-token'];
};

const getUserFromToken = async (token) => {
  const decodedToken = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET));
  const userId = decodedToken.payload.id;
  const user = await User.findByPk(userId);
  return user;
};

const verifyRole = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req);
    if (!token) {
      return res.status(403).send({ message: "No token provided." });
    }
    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    if (user.role === 'admin') {
      return next();
    }

    if ((req.method === 'PUT' || req.method === 'DELETE') && req.path.startsWith('/user/')) {
      const pathComponents = req.path.split('/');
      const userId = pathComponents[pathComponents.length - 1];
      if (userId === user.id.toString()) {
        return next();
      }
    }

    
 

    return res.status(403).send({ message: "You do not have permission to perform this action." });
  } catch (error) {
    console.error("Error in verifyRole middleware:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = verifyRole;
