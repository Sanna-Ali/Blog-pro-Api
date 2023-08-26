const express = require("express");
const connectedtodb = require("./config/connecttoDB");
const { notFound, errorHandler } = require("./middlewares/error");
require("dotenv").config();
//connection to db
connectedtodb(); //connectToDb
// init app
const app = express();
// midleware
app.use(express.json());
// routes //api/posts //http://localhost:8000/api/users/profile/642fff25ef76f6b218c51062
app.use("/api/auth", require("./routes/authroute"));
app.use("/api/users", require("./routes/userroute"));
app.use("/api/posts", require("./routes/postsroute"));
app.use("/api/comments", require("./routes/comment"));
app.use(notFound);
app.use(errorHandler);
//running the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
app;
