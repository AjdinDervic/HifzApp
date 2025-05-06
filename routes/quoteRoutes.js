const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");


const {
  getDailyQuote,
  createQuote,
  scheduleQuote,
  getAllQuotes,
  deleteQuote,
  unscheduleQuote
} = require("../controllers/quoteController");

router.get("/", getDailyQuote);
router.post("/", verifyToken, isAdmin, createQuote);
router.patch("/:id/schedule", verifyToken, isAdmin, scheduleQuote);
router.get("/all", isAdmin, getAllQuotes);
router.delete("/:id", verifyToken, isAdmin, deleteQuote);
router.patch("/:id/unschedule", verifyToken, isAdmin, unscheduleQuote);


module.exports = router;
