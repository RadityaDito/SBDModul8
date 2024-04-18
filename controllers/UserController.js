const { User } = require("../models/UserModel");

exports.getAllUser = async function (req, res) {
  try {
    const result = await User.find();
    res.status(200).json({ success: true, message: "Success", data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
