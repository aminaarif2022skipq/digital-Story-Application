const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const storyRoutes = require("./routes/story");
const commentRoutes = require("./routes/comment");
const reactionRoutes = require("./routes/reaction");
const verifyJWT = require("./middleware/jwtVerify");

//connect to database
dbConnect();

//built in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use("/auth", authRoutes);

//middleware to authenticate the user
app.use(verifyJWT);

//routes
app.use("/user", userRoutes);
app.use("/story", storyRoutes);
app.use("/comment", commentRoutes);
app.use("/reaction",(req,res,next) => { console.log('reaction router'); next()}, reactionRoutes);

mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`server is listening at port ${process.env.PORT}`);
  });
});
