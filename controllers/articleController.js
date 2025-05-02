let articles = [
  {
    id: 1,
    title: "Prvi članak",
    content: "Ovo je sadržaj prvog članka",
    author: "Furkan tim",
  },
  {
    id: 2,
    title: "Drugi članak",
    content: "Ovo je sadržaj drugog članka",
    author: "Ajdin",
  },
];


// Dohvacanje svih artikala u isto vrijeme, vjv ce biti potrebno za pocetnu stranicu
const getAllArticles = (req, res) => {
    res.json(articles);
}


//Dohvacanje artikala pomocu ID, kada nam trebadne jedan specifican clanak
const getArticleById = (req, res) =>{
    const id = parseInt(req.params.id);
    const article = articles.find(a => a.id === id);

    if(!article){
        return res.status(404).json(({message: "Članak nije pronađen."}));
    }
    res.json(article);
}


//Za adminovo kreiranje clanka, definisemo polja unutar clanka
const createArticle = (req, res) => {
  const { title, content, author, imageURL } = req.body;
  //Validacija unosa
  if (!title || !content || !author) {
    return res
      .status(400)
      .json({ message: "Sva polja su obavezna osim slike" });
  }

  //Kreiranje novog clanka
  const newArticle = {
    id: Date.now(),
    title,
    content,
    author,
    imageURL: imageURL || "https://via.placeholder.com/600x300",
  };

  articles.push(newArticle);

  //vracanje poruke ako je sve uspjesno
  res.status(201).json({
    message: "Novi artikal je usojesno kreiran",
    article: newArticle,
  });
};


//Kod za djelemicno azuriranje clanka
const updateArticle = (req, res) => {
  const id = parseInt(req.params.id);
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return res.status(404).json({ message: "Članak nije pronađen." });
  }

  const { title, content, author, imageURL } = req.body;

  
  if (title) article.title = title;
  if (content) article.content = content;
  if (author) article.author = author;
  if (imageURL) article.imageURL = imageURL;

  res.json({
    message: "Članak uspješno ažuriran.",
    article,
  });
};


//Brisanje clanka
const deleteArticle = (req, res) => {
  const id = parseInt(req.params.id);
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Članak nije pronađen." });
  }

  const deleted = articles.splice(index, 1); // briše 1 element na toj poziciji

  res.json({
    message: "Članak uspješno obrisan.",
    deleted: deleted[0],
  });
};





module.exports = {
  getAllArticles,
  articles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};

