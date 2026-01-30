require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
const app = express();
app.use(express.json());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);
mongoose
  .connect("mongodb://127.0.0.1:27017/myAppDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
