const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getProfile, updateProfile, getAllUsers, updateUserRole } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

router.get("/", auth, role("admin"), getAllUsers);
router.put("/role", auth, role("admin"), updateUserRole);

module.exports = router;