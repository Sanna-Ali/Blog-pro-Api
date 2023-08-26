const asyncHandler = require("express-async-handler");
const bcrybt = require("bcryptjs");
const { User, validateupdateuser } = require("../models/User");
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");
//get all users
// /api/users/profile
// get
// private "admin"//bearer
const getAlluser = asyncHandler(async (req, res) => {
  console.log(req.headers.token);
  const users = await User.find().populate("posts");
  res.status(200).json(users);
});
//get user
// /api/users/profile/:id
// get
// public
const getuser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("posts");
  if (!user) {
    return res.status(404).json("user not found");
  }
  res.status(200).json(user);
});
// update
// /api/users/profile/:id
// put
// private
//error // req.body // salt //find and update
const updateuser = asyncHandler(async (req, res) => {
  const { error } = validateupdateuser(req.body);
  if (error) {
    res.status(400).json("some thing wrong");
  }
  if (req.body.password) {
    const salt = await bcrybt.genSalt(10);
    req.body.password = await bcrybt.hash(req.body.password, salt);
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).select("-password");

  res.status(200).json(user);
});
const getcountuser = asyncHandler(async (req, res) => {
  const users = await User.count();
  res.status(200).json(users);
});
//profile photo upload
// /api/users/profile/profile-photo-upload
//post
// only logged user
const profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  //console.log(req.file);
  if (!req.file) {
    return res.status(400).json("no file provided");
  }
  res.status(200).json("your profile photo upload successfuly");
});
//////
// delete user profile
// /api/users/profile/:id
//delete
// only admin himself
const deleteUserprofile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).json("user not found");
  }
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json("deleted");
});
module.exports = {
  getAlluser,
  getuser,
  updateuser,
  getcountuser,
  profilePhotoUploadCtrl,
  deleteUserprofile,
};
