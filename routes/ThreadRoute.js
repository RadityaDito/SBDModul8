const express = require("express");
const threadController = require("../controllers/ThreadController");
const router = express.Router();

router.get("", threadController.getAllThread);

module.exports = router;
