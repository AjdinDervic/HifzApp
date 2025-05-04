const prisma = require("../db/prisma");

// Dohvacanje svih artikala u isto vrijeme, vjv ce biti potrebno za pocetnu stranicu
const getAllArticles = async (req, res) => {
  try{
    const articles = await prisma.article.findMany();
    res.json(articles);
  }catch(error){
    console.error(error);
    res.status(500).json({error: "Greška pri pronalasku članaka"});
  }
};

//Dohvacanje artikala pomocu ID, kada nam trebadne jedan specifican clanak
const getArticleById = async (req, res) => {
  const id = parseInt(req.params.id);
  try{
    const article = await prisma.article.findUnique({where: {id}});
    if (!article) {
      return res.status(404).json({ message: "Članak nije pronađen." });
    }
    res.json(article);
  }catch(error){
    console.error(error);
    res.status(500).json({error: "Greška pri pronalasku članka."});
  }
};

//Za adminovo kreiranje clanka, definisemo polja unutar clanka
const createArticle = async (req, res) => {
  const { title, content, author, imageURL } = req.body;
  //Validacija unosa
  if (!title || !content || !author) {
    return res
      .status(400)
      .json({ message: "Sva polja su obavezna osim slike" });
  }

  try{
    const newArticle = await prisma.article.create({
      data: {title, content, author, imageURL}
    });
    res.status(201).json({message: "Članak uspješno kreiran.", newArticle});
  }catch(error){
  console.log(error);
  res.status(500).json({error: "Greška prilikom kreiranja članka."});
  }
};


//Kod za djelemicno azuriranje clanka
const updateArticle = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, author, imageURL } = req.body;

  try{
    const updated = await prisma.article.update({
      where: {id},
      data: {title, content, author, imageURL},
    });
    res.json({message: "Članak je uspješno ažuriran."});
  }catch(error){
    res.status(500).json({error: "Greška prilikom ažuriranja članka"});
  } 
};


//Brisanje clanka
const deleteArticle = async (req, res) => {
  const id = parseInt(req.params.id);
 try{
await prisma.article.delete({ where: { id } });
res.json({ message: "Članak uspješno izbrisan." });
 }catch(error){
  res.status(500).json({ error: "Greška prilikom brisanja članka." });
 }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
