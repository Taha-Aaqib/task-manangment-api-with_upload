const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const fs = require("fs");
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user.userId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      {
        new: true,
      },
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:id/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!task) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Task not found" });
    }
    task.attachments.push({
      filename: req.file.originalname,
      filepath: req.file.path,
      size: req.file.size,
    });
    await task.save();
    res.status(201).json({ message: "File uploaded", task });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id/download/:fileIndex", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!task || !task.attachments[req.params.fileIndex]) {
      return res.status(404).json({ error: "File not found" });
    }
    const attachment = task.attachments[req.params.fileIndex];
    res.download(attachment.filepath, attachment.filename);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id/file/:fileIndex", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!task || !task.attachments[req.params.fileIndex]) {
      return res.status(404).json({ error: "File not found" });
    }
    fs.unlinkSync(task.attachments[req.params.fileIndex].filepath);
    task.attachments.splice(req.params.fileIndex, 1);
    await task.save();
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
