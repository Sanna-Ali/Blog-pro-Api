const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
// register "sign up"
///api/auth/register
//post
// public
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  //validation
  // already
  //hash
  //new user save
  //res
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "user already register" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(req.body.password, salt);
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashpassword,
  });
  await user.save();
  res.status(201).json("you registered successfuly,please log in ");
});
// register "log in"
///api/auth/register
//post
// public
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  //validate
  // user exists
  //pass
  //token
  //res
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json("invalid email or password");
  }
  const ispasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!ispasswordMatch) {
    return res.status(400).json("invalid email or password");
  }
  const token = user.generatetoken();
  res.status(200).json({
    _id: user._id,
    isAdmain: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
  });
});
