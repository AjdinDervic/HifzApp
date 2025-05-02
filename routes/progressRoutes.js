const express = require("express");
const router = express.Router();
const  {
startProgress,
updateProgress,
resetProgress,
getUserProgress
} = require("../controllers/progressController.js");

router.post("/start", startProgress);
router.patch("/update", updateProgress);
router.delete("/reset", resetProgress);
router.get("/", getUserProgress);


module.exports = router;