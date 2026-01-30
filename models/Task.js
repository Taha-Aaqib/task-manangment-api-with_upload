const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attachments:[
    {
      filename: String,
      filepath: String,
      size: Number,
      uploadedAt:{type:Date,dafult: Date.now}
    }
  ]
});
module.exports = mongoose.model("Task", taskSchema);
