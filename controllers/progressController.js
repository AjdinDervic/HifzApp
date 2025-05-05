const prisma = require('../db/prisma');

// START PROGRESS
const startProgress = async (req, res) => {
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
  let learningMode = "GamifiedExplorer"; // default
  if (method === "redom") {
    learningMode = "MarathonMode";
  } else if (method === "krugovi") {
    learningMode = "SprintMode";
  } else if (method === "prilagodeni") {
    learningMode = "AdaptiveQuest";
  }

  const pagesLearned = learnedPages || [];
  const totalLearned = pagesLearned.length;

  // ✅ Početni bedževi
  let badges = ["Start Progress"];

  if (totalLearned >= 200) {
    badges.push("Veteranski start");
  } else if (totalLearned >= 150) {
    badges.push("Hifz-pionir");
  } else if (totalLearned >= 100) {
    badges.push("Ustrajnost");
  } else if (totalLearned >= 50) {
    badges.push("Dobri temelji");
  }

try {
  const createdProgress = await prisma.progress.create({
    data: {
      userId,
      method,
      learnedPages: pagesLearned,
      totalLearned,
      newLearnedCount: 0,
      level: 1,
      badges,
      learningMode,
    },
  });

  res.status(201).json({
    message: "Progress uspješno započet!",
    progress: createdProgress,
  });
} catch (error) {
  console.error("Greška prilikom kreiranja progress-a:", error);
  res.status(500).json({ message: "Greška na serveru." });
}
};

  


// POCETAK UPDATE METODE
const {
  isJuzCompleted,
  isCircleCompleted,
  juzMap,
  circleMap,
} = require("../helpers/progressHelper");

const updateProgress = async (req, res) => {
  const { userId } = req.body;

  //const userId = req.user.id; 
  const { pages } = req.body; 

  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    return res
      .status(400)
      .json({
        message: "Polje 'pages' mora biti niz sa barem jednom stranicom.",
      });
  }

  try {
    //  Pronađi progress za korisnika
    const progress = await prisma.progress.findUnique({
      where: { userId },
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress nije pronađen." });
    }

    //  Filtriraj stranice koje su već označene
    const newPages = pages.filter(
      (page) => !progress.learnedPages.includes(page)
    );
    if (newPages.length === 0) {
      return res
        .status(400)
        .json({ message: "Sve stranice su već ranije dodane." });
    }

    //  Novi podaci
    const updatedLearnedPages = [...progress.learnedPages, ...newPages];
    const totalLearned = updatedLearnedPages.length;
    const newLearnedCount = progress.newLearnedCount + newPages.length;
    let level = progress.level;
    let badges = [...progress.badges];

    // 🎖 Leveling sistem
    const importantMilestones = [1, 3, 5, 8, 10, 15, 20, 25, 30];
    if (
      importantMilestones.includes(newLearnedCount) ||
      (newLearnedCount > 30 && newLearnedCount % 10 === 0)
    ) {
      level += 1;
      badges.push(`Level ${level} - ${newLearnedCount} stranica`);
    }

    // 🎖 Provjera džuzova
    if (progress.method === "redom") {
      for (const juzNumber in juzMap) {
        if (isJuzCompleted(juzNumber, updatedLearnedPages)) {
          const badge = `Kompletiran džuz ${juzNumber}`;
          if (!badges.includes(badge)) {
            badges.push(badge);
          }
        }
      }
    }

    //  Provjera krugova
    if (progress.method === "krugovi") {
      for (const circleNumber in circleMap) {
        if (isCircleCompleted(circleNumber, updatedLearnedPages)) {
          const badge = `Kompletiran krug ${circleNumber}`;
          if (!badges.includes(badge)) {
            badges.push(badge);
          }
        }
      }
    }

    // Spasi u bazu
    const updated = await prisma.progress.update({
      where: { userId },
      data: {
        learnedPages: updatedLearnedPages,
        totalLearned,
        newLearnedCount,
        level,
        badges,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "Progress uspješno ažuriran!",
      progress: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Greška na serveru." });
  }
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

const getUserProgress =async (req, res) => {
const userId = parseInt(req.query.userId);



  if (!userId) {
    return res.status(400).json({ message: "userId je obavezan." });
  }
  try{
    const progress = await prisma.progress.findUnique({where: {userId}});
    if (!progress) {
      return res.status(404).json({ message: "Progress nije pronađen." });
    }

    res.status(200).json({ progress });

  }catch(error){
    console.error(error);
    res.status(500).json({message: "Greška na serveru."});

  }
};


module.exports = {
  startProgress,
  updateProgress,
  resetProgress,
  getUserProgress
};