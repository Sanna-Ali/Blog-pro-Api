const router = require("express").Router();
const {
  createPostCrtl,
  getAllPostsCtrl,
  getsinglepost,
  getCountCtrl,
  deletePostCtrl,
  putPostCtrl,
  ud,
  togglelikeCtrl,
} = require("../controller/postcontroller");
const photoupload = require("../middlewares/photoupload");
const {
  verifytoken,
  verfiyTokenAndAuthorization,
} = require("../middlewares/verifytken");
const validateObjectId = require("../middlewares/validateObject");
const photupload = require("../middlewares/photoupload");

//api/posts
router
  .route("/")
  .post(verifytoken, photoupload.single("image"), createPostCrtl)
  .get(getAllPostsCtrl);
router.route("/count").get(getCountCtrl);
router
  .route("/:id")
  .get(validateObjectId, getsinglepost)
  .put(validateObjectId, verifytoken, putPostCtrl)
  .delete(validateObjectId, verifytoken, deletePostCtrl);
//router.route()
router
  .route("/update-image/:id")
  .put(validateObjectId, verifytoken, photupload.single("image"), ud);
router.route("/like/:id").put(validateObjectId, verifytoken, togglelikeCtrl);
module.exports = router;
