const express = require("express");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/taskController");

const router = express.Router();

router.post("/", auth, controller.createTask);
router.get("/", auth, controller.getTasks);
router.get("/:id", auth, controller.getTask);
router.put("/:id", auth, controller.updateTask);
router.delete("/:id", auth, controller.deleteTask);

module.exports = router;