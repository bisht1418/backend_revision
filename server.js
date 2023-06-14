const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const { userRouter } = require("./Router/users.router");
require("dotenv").config();
const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

app.listen(port, async () => {
  try {
    await connectDB();
  } catch (error) {
    console.log("error");
  }
  console.log(`connected to the port ${port}`);
});
