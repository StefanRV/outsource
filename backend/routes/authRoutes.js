const { verifySignUp } = require("../middleware");
const controller = require("../controllers/authController");

module.exports = function(app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "beaver, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/api/auth/verify", controller.verifyCodeAndRegister);

  app.post("/api/auth/signIn", controller.signIn);

  app.get("/api/auth/profile", controller.getProfile);
};
