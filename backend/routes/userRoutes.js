const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authJwt = require("../middleware/authJose");
const verifyRole = require('../middleware/verifyRole');

console.log('auth:' + authJwt);

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get('/user', [authJwt.verifyToken, verifyRole], userController.findAll);

router.get('/user/:username', [authJwt.verifyToken, verifyRole], userController.findUsersByUsername);

router.put('/user/:id', [authJwt.verifyToken, verifyRole], userController.updateUser);

router.delete('/user/:id', [authJwt.verifyToken, verifyRole], userController.deleteUser);

router.post("/recharge", [authJwt.verifyToken], userController.rechargeBalance);

router.post('/favorites', userController.addToFavorites);

router.delete('/favorites', userController.removeFromFavorites);

router.get('/favorites', [authJwt.verifyToken], userController.getFavorites);

router.post('/favorites/users', userController.addUserToFavorites);

router.delete('/favorites/users', userController.removeUserFromFavorites);

router.get('/favorites/users', userController.getFavoriteUsers);

router.get('/:id',  userController.getUserProfile);

router.get('/userprofile/:id', userController.getUserById);

router.get('/profile', [authJwt.verifyToken], userController.getUserProfile);

module.exports = router;
