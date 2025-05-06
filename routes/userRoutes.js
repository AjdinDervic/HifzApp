const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

const {
getAllUsers,
getUserById,
updateUser,
deleteUser
} = require("../controllers/userController");

router.get("/", verifyToken , isAdmin, getAllUsers);
//router.post("/", createUser);
router.get("/:id", verifyToken, getUserById);
router.patch("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);



module.exports = router;