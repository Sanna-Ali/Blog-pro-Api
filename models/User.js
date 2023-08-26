const { object } = require("joi");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
//User Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    password: { type: String, required: true, minlength: 5 },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
        publicId: null,
      },
    },
    bio: { type: String },
    isAdmin: { type: Boolean, default: false },
    isAccountVerified: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
UserSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});
UserSchema.methods.generatetoken = function () {
  return jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
    },
    process.env.SECRET_KEY
  );
};
const User = mongoose.model("User", UserSchema);

//validation
const validateRegisterUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(100).required(),
    email: Joi.string().trim().min(3).max(100).required().email(),
    password: Joi.string().trim().min(8).max(1024).required(),
  });
  return schema.validate(obj);
};
const validateLoginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(3).max(100).required().email(),
    password: Joi.string().trim().min(8).max(1024).required(),
  });
  return schema.validate(obj);
};
const validateupdateuser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(100),
    email: Joi.string().trim().min(3).max(100).email(),
    password: Joi.string().trim().min(8).max(1024),
    bio: Joi.string(),
  });
  return schema.validate(obj);
};

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateupdateuser,
};
