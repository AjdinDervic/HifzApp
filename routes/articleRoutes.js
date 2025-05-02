const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require("../controllers/articleController");


router.get("/", getAllArticles);
router.post("/", createArticle);
router.get("/:id", getArticleById);
router.patch("/:id", updateArticle);
router.delete("/:id", deleteArticle);


module.exports = router;
