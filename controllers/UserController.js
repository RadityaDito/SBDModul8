const bcrypt = require("bcrypt");
const { Thread } = require("../models/ThreadModel");
const { User } = require("../models/UserModel");

exports.getAllUser = async function (req, res) {
  try {
    const result = await User.find();
    res.status(200).json({ success: true, message: "Success", data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.createUser = async function (req, res) {
  try {
    const { name, npm, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

    const newUser = new User({
      name,
      npm,
      hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "Success", data: newUser });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Failed to create user: ${error.message}`,
    });
  }
};

exports.getUserPosts = async function (req, res) {
  try {
    const { userId } = req.params;

    const threads = await User.findById(userId).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "id name",
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully getUserPosts",
      data: threads,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Failed to getUsersPosts: ${error.message}`,
    });
  }
};

// exports.createUserV2 = async function (req, res) {
//   try {
//     const { userId, username, name, image, bio } = req.body;

//     const newUser = new User({
//       id: userId,
//       username: username,
//       name,
//       image,
//       bio,
//     });

//     await newUser.save();

//     // await User.findOneAndUpdate(
//     //   { id: userId },
//     //   {
//     //     id: userId,
//     //     username: username.toLowerCase(),
//     //     name,
//     //     image,
//     //     bio,
//     //   },
//     //   { upsert: true }
//     // );

//     res
//       .status(200)
//       .json({ success: true, message: "Success Create User", data: newUser });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: `Failed to create/update user: ${err.message}`,
//     });
//   }
// };

exports.updateUser = async function (req, res) {
  try {
    const { userId, username, name, image, bio } = req.body;

    await User.findOneAndUpdate(
      { id: userId },
      {
        id: userId,
        username: username.toLowerCase(),
        name,
        image,
        bio,
      },
      { upsert: true }
    );

    res.status(200).json({ success: true, message: "Success Create User" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: `Failed to create/update user: ${err.message}`,
    });
  }
};
