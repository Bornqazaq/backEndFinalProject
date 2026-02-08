const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getProfile, updateProfile, getAllUsers, updateUserRole, deleteUser } = require("../controllers/userController");
const validate = require("../middleware/validationMiddleware");
const { updateProfileSchema, updateRoleSchema } = require("../validators/userValidator");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, validate(updateProfileSchema), updateProfile);

router.get("/", auth, role("admin"), getAllUsers);
router.put("/role", auth, role("admin"), validate(updateRoleSchema), updateUserRole);
router.delete("/:id", auth, role("admin"), deleteUser);

module.exports = router;