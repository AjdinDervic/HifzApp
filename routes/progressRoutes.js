const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const  {
startProgress,
updateProgress,
resetProgress,
getUserProgress
} = require("../controllers/progressController.js");

router.post("/start", verifyToken, startProgress);
router.patch("/update", verifyToken, updateProgress);
router.delete("/reset", verifyToken, resetProgress);
router.get("/", verifyToken, getUserProgress);


module.exports = router;