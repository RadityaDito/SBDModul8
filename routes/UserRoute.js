const express = require("express");
const userController = require("../controllers/UserController");
const router = express.Router();

router.get("", userController.getAllUser);
router.get("/:userId", userController.getUserPosts);
router.post("", userController.createUser);

module.exports = router;
