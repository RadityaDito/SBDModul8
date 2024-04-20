const express = require("express");
const threadController = require("../controllers/ThreadController");
const router = express.Router();

router.get("", threadController.getAllParentThread);
router.get("/:threadId", threadController.getThreadById);
router.post("", threadController.createThread);
router.post("/addComment", threadController.addCommentToThread);

module.exports = router;
