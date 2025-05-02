

// Ovo dodaj na vrh fajla
let progressList = [];

// START PROGRESS
const startProgress = (req, res) => {
  const { userId, method, learnedPages } = req.body;

  // ✅ Validacija obaveznih polja
  if (!userId || !method) {
    return res.status(400).json({ message: "userId i method su obavezni." });
  }

  // ✅ Validacija dozvoljenih metoda
  const allowedMethods = ["redom", "krugovi", "prilagodeni"];
  if (!allowedMethods.includes(method)) {
    return res.status(400).json({ message: "Nevalidna metoda učenja. Dozvoljeno: redom, krugovi, prilagodeni." });
  }

  // ✅ Dinamičko određivanje learningMode na osnovu metode
  let learningMode = "motivacija"; // default
  if (method === "redom") {
    learningMode = "maraton";
  } else if (method === "krugovi") {
    learningMode = "krugovi-motivacija";
  } else if (method === "prilagodeni") {
    learningMode = "personalizacija";
  }

  // ✅ Inicijalizacija početnih vrijednosti
  const pagesLearned = learnedPages || [];
  const totalLearned = pagesLearned.length;

  // ✅ Početni bedževi
  let badges = ["Start Progress"];
  if (totalLearned >= 50) {
    badges.push("Veteran Start"); // Ako korisnik već zna puno stranica
  }

  // ✅ Kreiranje progress objekta
  const newProgress = {
    userId,
    method,
    learnedPages: pagesLearned,
    totalLearned: totalLearned,
    newLearnedCount: 0, // Nove stranice naučene kroz tvoju platformu
    level: 1,           // Start level
    badges: badges,
    learningMode: learningMode,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // ✅ Dodavanje u memorijsku listu
  progressList.push(newProgress);

  // ✅ Odgovor servera
  res.status(201).json({
    message: "Progress uspješno započet!",
    progress: newProgress
  });
};


// POCETAK UPDATE METODE

const {
  isJuzCompleted,
  isCircleCompleted,
  juzMap,
  circleMap,
} = require("../helpers/progressHelper");
const updateProgress = (req, res) => {
  const { userId, page } = req.body;

  if (!userId || !page) {
    return res.status(400).json({ message: "userId i page su obavezni." });
  }

  const progress = progressList.find((p) => p.userId === userId);

  if (!progress) {
    return res.status(404).json({ message: "Progress nije pronađen." });
  }

  if (progress.learnedPages.includes(page)) {
    return res
      .status(400)
      .json({ message: "Ova stranica je već označena kao naučena." });
  }

  // Dodajemo novu stranicu
  progress.learnedPages.push(page);
  progress.totalLearned += 1;
  progress.newLearnedCount += 1;
  progress.updatedAt = new Date();

  // Novi leveling sistem
  const importantMilestones = [1, 3, 5, 8, 10, 15, 20, 25, 30];

  if (
    importantMilestones.includes(progress.newLearnedCount) ||
    (progress.newLearnedCount > 30 && progress.newLearnedCount % 10 === 0)
  ) {
    progress.level += 1;
    progress.badges.push(
      `Level ${progress.level} - ${progress.newLearnedCount} stranica`
    );
  }

  // Dodatna provjera za džuz/krug
  if (progress.method === "redom") {
    for (const juzNumber in juzMap) {
      if (isJuzCompleted(juzNumber, progress.learnedPages)) {
        if (!progress.badges.includes(`Kompletiran džuz ${juzNumber}`)) {
          progress.badges.push(`Kompletiran džuz ${juzNumber}`);
        }
      }
    }
  }

  if (progress.method === "krugovi") {
    for (const circleNumber in circleMap) {
      if (isCircleCompleted(circleNumber, progress.learnedPages)) {
        if (!progress.badges.includes(`Kompletiran krug ${circleNumber}`)) {
          progress.badges.push(`Kompletiran krug ${circleNumber}`);
        }
      }
    }
  }

  res.status(200).json({
    message: "Progress uspješno ažuriran!",
    progress,
  });
};





// POCETAK RESET METODE:
const resetProgress = (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId je obavezan." });
  }

  const progressIndex = progressList.findIndex((p) => p.userId === userId);

  if (progressIndex === -1) {
    return res.status(404).json({ message: "Progress nije pronađen." });
  }

  // Brišemo postojeći progress
  progressList.splice(progressIndex, 1);

  res.status(200).json({ message: "Progress uspješno resetovan." });
};


// GET metoda

const getUserProgress = (req, res) => {
  const { userId } = req.query; // Pazimo: ovdje čitamo iz query stringa, ne iz body-ja!

  if (!userId) {
    return res.status(400).json({ message: "userId je obavezan." });
  }

  const progress = progressList.find((p) => p.userId == userId);

  if (!progress) {
    return res.status(404).json({ message: "Progress nije pronađen." });
  }

  res.status(200).json({ progress });
};


module.exports = {
  startProgress,
  updateProgress,
  resetProgress,
  getUserProgress
};