const mongoose = require("mongoose");
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("connected to mongodb");
    });
  } catch (error) {
    console.log("connection failed to mongodb", error);
  }
};
module.exports = connectToDb;
