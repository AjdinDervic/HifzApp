const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const{
    register,
    loginUser
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", loginUser);
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});



module.exports = router;