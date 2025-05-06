const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const {
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle
} = require("../controllers/articleController");


router.get("/", getAllArticles);
router.post("/", verifyToken, isAdmin);
router.get("/:id", getArticleById);
router.patch("/:id", verifyToken, isAdmin, updateArticle);
router.delete("/:id", verifyToken, isAdmin, deleteArticle);


module.exports = router;
