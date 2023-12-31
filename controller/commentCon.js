const {
  validateUpdateComment,
  validateCreateComment,
  Comment,
} = require("../models/Comment");
const { User } = require("../models/User");
const { verifytoken } = require("../middlewares/verifytken");
const asynchandler = require("express-async-handler");
module.exports.createCommentCtrl = asynchandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  const profile = await User.findById(req.user.id);
  const comment = await Comment.create({
    postId: req.body.postId,
    text: req.body.text,
    user: req.user.id,
    username: profile.username,
  });
  res.status(201).json(comment);
});
module.exports.getallCommentCtrl = asynchandler(async (req, res) => {
  const comments = await Comment.find()
    .select("text")
    .populate("user", ["-password", "-email", "-_id"])
    .select("username");
  res.status(200).json(comments);
});
module.exports.deleteCommentCtrl = asynchandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json("not found");
  }
  if (req.user.isAdmin || req.user.id === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("ddellllleted");
  } else {
    res.status(403).json("not allowed");
  }
});
