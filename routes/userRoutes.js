const express = require("express");
const router = express.Router();

const {
getAllUsers,
getUserById,
createUser,
updateUser,
deleteUser
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);



module.exports = router;