const { jwtVerify } = require('jose');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  
  if (!token) {
    return res.status(401).send({
      message: "No token provided!",
    });
  }

  try {
    jwtVerify(token, new TextEncoder().encode(process.env.SECRET))
      .then((decoded) => {
        req.userId = decoded.payload.id;
        req.userRole = decoded.payload.role;
        next();
      })
      .catch(() => {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

module.exports = {
  verifyToken,
};
