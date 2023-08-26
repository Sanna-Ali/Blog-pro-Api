const {
  createCommentCtrl,
  getallCommentCtrl,
  deleteCommentCtrl,
} = require("../controller/commentCon");
const validateObject = require("../middlewares/validateObject");
const {
  verifytoken,
  vervifyTokenAndAdmain,
} = require("../middlewares/verifytken");

const router = require("express").Router();
router
  .route("/")
  .post(verifytoken, createCommentCtrl)
  .get(vervifyTokenAndAdmain, getallCommentCtrl);
router.route("/:id").delete(validateObject, verifytoken, deleteCommentCtrl);
module.exports = router;
