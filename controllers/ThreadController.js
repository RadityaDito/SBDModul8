const { model } = require("mongoose");
const { Thread } = require("../models/ThreadModel");
const { User } = require("../models/UserModel");

exports.getAllParentThread = async function (req, res) {
  try {
    const result = await Thread.find()
      .where("parentId")
      .equals(null)
      .sort({ createdAt: 1 })
      .populate("children");
    res.status(200).json({
      success: true,
      message: "Successfully getAllParentThread",
      data: result,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getThreadById = async function (req, res) {
  try {
    const { threadId } = req.params;

    const result = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
          },
          {
            path: "children",
            populate: {
              path: "author",
              model: User,
            },
          },
        ],
      })
      .exec();

    if (!result) {
      throw new Error("Thread not found");
    }

    res.status(200).json({
      success: true,
      message: "Successfully get thread by ID",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: `Error getting thread by ID: ${err.message}`,
    });
  }
};

exports.createThread = async function (req, res) {
  try {
    const { text, author } = req.body;

    const createThread = await Thread.create({ text, author });

    //Update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    res.status(201).json({
      success: true,
      message: "Successfully creating new thread",
      data: createThread,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: `Error Creating Thread: ${err.message}`,
    });
  }
};

exports.addCommentToThread = async function (req, res) {
  try {
    const { threadId, commentText, userId } = req.body;

    //Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    //Create a new thread with the comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    //Save the new thread
    const savedCommentThread = await commentThread.save();

    // Update the original thread to include the new comment
    originalThread.children.push(savedCommentThread._id);

    //Save the updated original thread
    await originalThread.save();

    res.status(201).json({
      success: true,
      message: "Successfully adding comment to thread",
      data: savedCommentThread,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: `Error adding comment to thread: ${err.message}`,
    });
  }
};
