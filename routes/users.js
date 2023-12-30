var express = require("express");
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth");
const refreshTokenMiddleware = require("../middleware/refreshToken");
var router = express.Router();

/* GET users listing. */
router.get("/", [authMiddleware, refreshTokenMiddleware], userController.index);

router.route("/:id").get(authMiddleware, userController.show);

router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
