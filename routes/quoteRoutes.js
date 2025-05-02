const express = require("express");
const router = express.Router();

const {
  getDailyQuote,
  createQuote,
  scheduleQuote,
  getAllQuotes,
  deleteQuote,
  unscheduleQuote
} = require("../controllers/quoteController");

router.get("/", getDailyQuote);
router.post("/", createQuote);
router.patch("/:id/schedule", scheduleQuote);
router.get("/all", getAllQuotes);
router.delete("/:id", deleteQuote);
router.patch("/:id/unschedule", unscheduleQuote);


module.exports = router;
