const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const userRouter = require("./userRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRouter);

app.get("/", (req, res, next) => {
  console.log("hii1");
  res.send("Started");
});

mongoose.connect("mongodb://127.0.0.1:27017/loginData").then(() => {
  console.log("Database Created");
});

app.listen(4001);
