const prisma = require("../db/prisma");

// Dohvati citat za danas
const getDailyQuote = async (req, res) => {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setUTCHours(23, 59, 59, 999);

  try {
    // 👇 Zakazan za danas
    const scheduledQuote = await prisma.quote.findFirst({
      where: {
        scheduledDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (scheduledQuote) {
      return res.status(200).json({ quote: scheduledQuote });
    }

    // 👇 Random citat
    const allQuotes = await prisma.quote.findMany();
    if (allQuotes.length === 0) {
      return res.status(404).json({ message: "Nema dostupnih citata." });
    }

    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    const randomQuote = allQuotes[randomIndex];

    res.status(200).json({ quote: randomQuote });
  } catch (error) {
    res.status(500).json({ message: "Greška na serveru." });
  }
};

// KONEKTOVANO S BAZOM - Dodaj novi citat
const createQuote = async (req, res) => {
  const { text, author, source, scheduledDate } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Tekst citata je obavezan." });
  }

  try{
    const newQuote = await prisma.quote.create({
      data: {text, author, source, scheduledDate}
    });
    res.status(201).json({message: "Citat uspjesno kreiran."});
  }catch(error){
    console.error(error);
    res.status(500).json({error: "Greška na serveru."});
  }
};

// Zakaži citat za određeni datum
const scheduleQuote = async (req, res) => {
  const { id } = req.params;
  const { scheduledDate } = req.body;

  if (!scheduledDate) {
    return res.status(400).json({ message: "Datum je obavezan." });
  }

  try {
    const updated = await prisma.quote.update({
      where: { id: parseInt(id) },
      data: { scheduledDate: new Date(scheduledDate) },
    });

    res
      .status(200)
      .json({ message: "Citat uspješno zakazan.", quote: updated });
  } catch (error) {
    res.status(404).json({ message: "Citat nije pronađen." });
  }


};

//OTKAZIVANJE citata
const unscheduleQuote = async (req, res) => {
  const { id } = req.params;

try {
  const updated = await prisma.quote.update({
    where: { id: parseInt(id) },
    data: { scheduledDate: null }
  });

  res.status(200).json({ message: "Schedule uspješno uklonjen.", quote: updated });
} catch (error) {
  res.status(404).json({ message: "Citat nije pronađen." });
}
};

// KONEKTOVANO S BAZOM -Dohvati sve citate 
const getAllQuotes = async (req, res) => {
  try{
  const quotes = await prisma.quote.findMany();
  res.json(quotes);
  }catch(error){
    res.status(500).json({error: "Greka na serveru."});
  }
  

};

//KONEKTOVANO S BAZOM - BRISANJE izreke
const deleteQuote = async (req, res) => {
  const id  = parseInt(req.params.id);

  try{
    await prisma.quote.delete({where: {id}});
    res.json({message: "Citat uspješno izbrisan."});
  }catch(error){
    console.error(error);
    res.status(500).json({error: "Greška na serveru."});
  }
};





module.exports = {
  getDailyQuote,
  createQuote,
  scheduleQuote,
  getAllQuotes,
  deleteQuote,
  unscheduleQuote
};
