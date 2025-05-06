const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token nije dostavljen." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // korisnik dostupan u ruti
    next();
  } catch (error) {
    console.error("Nevalidan token:", error);
    return res.status(403).json({ message: "Nevažeći token." });
  }
};

module.exports = verifyToken;
