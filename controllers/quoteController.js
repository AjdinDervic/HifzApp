let quotesList = []; // Memorijsko čuvanje citata

// Dohvati citat za danas
const getDailyQuote = (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  // Prvo pokušaj pronaći citat koji je zakazan za danas
  const scheduledQuote = quotesList.find((q) => q.scheduledDate === today);

  if (scheduledQuote) {
    return res.status(200).json({ quote: scheduledQuote });
  }

  // Ako nema zakazanih, izvuci random citat
  if (quotesList.length === 0) {
    return res.status(404).json({ message: "Nema dostupnih citata." });
  }

  const randomIndex = Math.floor(Math.random() * quotesList.length);
  const randomQuote = quotesList[randomIndex];

  res.status(200).json({ quote: randomQuote });
};

// Dodaj novi citat
const createQuote = (req, res) => {
  const { text, source } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Tekst citata je obavezan." });
  }

  const newQuote = {
    id: Date.now(), // Privremeni ID
    text,
    source: source || "Nepoznat",
    createdAt: new Date().toISOString(),
  };

  quotesList.push(newQuote);

  res.status(201).json({ message: "Citat uspješno kreiran.", quote: newQuote });
};

// Zakaži citat za određeni datum
const scheduleQuote = (req, res) => {
  const { id } = req.params;
  const { scheduledDate } = req.body;

  if (!scheduledDate) {
    return res.status(400).json({ message: "Datum je obavezan." });
  }

  const quote = quotesList.find((q) => q.id == id);

  if (!quote) {
    return res.status(404).json({ message: "Citat nije pronađen." });
  }

  quote.scheduledDate = scheduledDate;

  res.status(200).json({ message: "Citat uspješno zakazan.", quote });
};

//OTKAZIVANJE citata
const unscheduleQuote = (req, res) => {
  const { id } = req.params;

  const quote = quotesList.find((q) => q.id == id);

  if (!quote) {
    return res.status(404).json({ message: "Citat nije pronađen." });
  }

  quote.scheduledDate = null;

  res.status(200).json({ message: "Schedule uspješno uklonjen.", quote });
};

// Dohvati sve citate
const getAllQuotes = (req, res) => {
  res.status(200).json({ quotes: quotesList });
};

//BRISANJE izreke
const deleteQuote = (req, res) => {
  const { id } = req.params;

  const quoteIndex = quotesList.findIndex((q) => q.id == id);

  if (quoteIndex === -1) {
    return res.status(404).json({ message: "Citat nije pronađen." });
  }

  quotesList.splice(quoteIndex, 1);

  res.status(200).json({ message: "Citat uspješno obrisan." });
};





module.exports = {
  getDailyQuote,
  createQuote,
  scheduleQuote,
  getAllQuotes,
  deleteQuote,
  unscheduleQuote
};
