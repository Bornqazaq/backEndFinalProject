const Task = require("../models/Task");
const fs = require("fs");
const path = require("path");

exports.createTask = async (req, res, next) => {
  try {
    const taskData = { ...req.body, user: req.user.id };
    
    if (req.file) {
      taskData.image = `/uploads/${req.file.filename}`;
    }
    
    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().populate("user", "username email");
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};


exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.json(task);
  } catch (error) {
    next(error);
  }
};


exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};


exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    if (task.image) {
      const imagePath = path.join(__dirname, "..", task.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    task.status = !task.status;
    await task.save();
    
    res.json({ 
      message: `Task marked as ${task.status ? 'completed' : 'incomplete'}`,
      task 
    });
  } catch (error) {
    next(error);
  }
};