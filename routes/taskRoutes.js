const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/taskController");
const upload = require("../config/multer");
const validate = require("../middleware/validationMiddleware");
const { createTaskSchema, updateTaskSchema } = require("../validators/taskValidator");

const router = express.Router();

router.post("/", auth, upload.single("image"), validate(createTaskSchema), controller.createTask);
router.get("/", auth, controller.getTasks);
router.get("/all", auth, role("admin"), controller.getAllTasks);
router.get("/:id", auth, controller.getTask);
router.put("/:id", auth, validate(updateTaskSchema), controller.updateTask);
router.patch("/:id/toggle-status", auth, controller.toggleTaskStatus);
router.delete("/:id", auth, controller.deleteTask);

module.exports = router;