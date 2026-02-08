const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"],
    minlength: [1, "Title must not be empty"],
    maxlength: [200, "Title must not exceed 200 characters"],
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, "Description must not exceed 1000 characters"],
    trim: true
  },
  status: { type: Boolean, default: false },
  dueDate: Date,
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);