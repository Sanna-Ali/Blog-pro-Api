const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
//const Post = require("../models/Post");
const { Comment } = require("../models/Comment");
const {
  Post,
  validateUpdatePost,
  validateCreatePost,
} = require("../models/Post");
const { post } = require("../routes/userroute");
const { result } = require("@hapi/joi/lib/base");
// create new post
// /api/posts
//post
// only logged in
module.exports.createPostCrtl = asyncHandler(async (req, res) => {
  // validation for data& image
  //upload photo
  // create new post and sae it to db
  // res
  // remove image from server
  if (!req.file) {
    return res.status(400).json("no image provided");
  }
  const { error } = validateCreatePost(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
  }

  //upload
  //const imagepath = path.join(__dirname, `../images/${req.file.filename}`);
  //const result = await cloudinaryUploadImage(imagepath)
  // create new post
  //onnne // we need save
  // const opost=new Post({title:req.body.title})
  // await opost.save()
  //two // dont need save
  const post = await Post.create({
    // Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    //image: { url: result.secure_url, publicId: result.secure_publicId },
  });
  //
  res.status(201).json(post);
  //reemove
  // fs.unlinkSync(imagePath)
});
// get
//api/posts
// public
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category }).populate("user", ["-password"]);
  } else {
    //
    posts = await Post.find().sort({ _id: -1 }).populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});
module.exports.getsinglepost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", [
    "-password",
  ]);
  if (!post) {
    return res.status(404).json("not found");
  }
  res.status(200).json(post);
});
module.exports.getCountCtrl = asyncHandler(async (req, res) => {
  const count = await Post.count();
  res.status(200).json(count);
});
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const deletedpost = await Post.findById(req.params.id);
  if (!deletedpost) {
    return res.status(404).json("not found");
  }
  if (req.user.isAdmin || req.user.id === deletedpost.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    //await clouinaryRemoveImage(post.image.publicId)
    await Comment.deleteMany({ postId: post._id });

    res.status(200).json({
      message: "post has been deleted successfully",
      postId: deletedpost._id,
    });
  } else {
    res.status(403).json("access denied,forbidden");
  }
});
module.exports.putPostCtrl = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json("not found");
  }
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  if (req.user.id !== post.user.toString()) {
    return res.status(403).json("access denied,you are not allowed ");
  }
  post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ).populate("user", ["-password"]);
  res.status(200).json(post);
});
module.exports.ud = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json("no image provided");
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json("not found");
  }
  if (req.user.id !== post.user.toString()) {
    return res.status(403).json("access denied");
  }
  //4
  //await cloudinaryRemoveImage(post.image.publicId)
  //5
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  //  const result = await cloudinaryUploadImage(imagePath);
  const updatePost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: { image: { url: result.secure_url, publicIdd: result.public_Id } },
    },
    { new: true }
  ).populate("user", ["-password"]);
  res.status(200).json(updatePost);
  fs.unlinkSync(imagePath);
});
// toggle like
// /api/posts/like/:id
//put (private only logged in user)
module.exports.togglelikeCtrl = asyncHandler(async (req, res) => {
  const loggedInUser = req.user.id;
  const { id: postId } = req.params;
  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json("not found");
  }
  const isPostAlreadLiked = post.likes.find(
    (user) => user.toString() === loggedInUser
  );
  if (isPostAlreadLiked) {
    post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: loggedInUser } },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: loggedInUser } },
      { new: true }
    );
  }
  res.status(200).json(post);
});
