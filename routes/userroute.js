//const getuser = require("../controller/userController");
//const getAlluser = require("../controller/userController");
const {
  verifytoken,
  vervifyTokenAndAdmain,
  verifytokenAndonlyuser,
  verfiyTokenAndAuthorization,
} = require("../middlewares/verifytken");
const {
  getAlluser,
  getuser,
  updateuser,
  getcountuser,
  profilePhotoUploadCtrl,
  deleteUserprofile,
} = require("../controller/userController");

const validateObjectId = require("../middlewares/validateObject");
//const updateuser = require("../controller/userController");
//onst getcountuser = require("../controller/userController");
//const profilePhotoUploadCtrl = require("../controller/userController");
const photupload = require("../middlewares/photoupload");
//const deleteUserprofile = require("../controller/userController");
const router = require("express").Router();

// /api/users/profile
router.route("/profile").get(vervifyTokenAndAdmain, getAlluser);
// /api/users/profile/:id
//router.route("/profile/:id").get(validateObjectId, getuser);
//api/users/profile/:id
router
  .route("/profile/:id")
  .get(validateObjectId, getuser)
  .put(validateObjectId, verifytokenAndonlyuser, updateuser)
  .delete(validateObjectId, verfiyTokenAndAuthorization, deleteUserprofile);
// /api
router.route("/count").get(vervifyTokenAndAdmain, getcountuser);
router
  .route("/profile/profile-photo-upload") //profilePhotoUploadCtrl //photupload
  .post(verifytoken, photupload.single("image"), profilePhotoUploadCtrl);
module.exports = router;
