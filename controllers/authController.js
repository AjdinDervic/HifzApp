const bcrypt = require("bcrypt");
const prisma = require("../db/prisma");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, surname, email, password, city, role, userType } = req.body;

  if (!name || !surname || !email || !password || !city || !userType) {
    return res.status(400).json({ message: "Sva polja su obavezna." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "Email je već registrovan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: hashedPassword,
        city,
        role: role || "USER",
        userType,
      },
    });

    res.status(201).json({
      message: "Uspješna registracija!",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("Greška pri registraciji:", error);
    res.status(500).json({ message: "Greška na serveru." });
  }
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Provjera da li su podaci poslani
  if (!email || !password) {
    return res.status(400).json({ message: "Email i lozinka su obavezni." });
  }
try {
  // Pronađi korisnika po emailu
  const user = await prisma.user.findUnique({ where: { email } });

  // Ako korisnik ne postoji
  if (!user) {
    return res.status(401).json({ message: "Pogrešan email ili lozinka." });
  }

  // Provjera lozinke
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Pogrešan email ili lozinka." });
  }
const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

// Odgovor prema korisniku
res.status(200).json({
  message: "Uspješna prijava!",
  token,
  user: {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    city: user.city,
    role: user.role,
    userType: user.userType,
  },
});


} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Greška na serveru." });
}



};



module.exports = {
    register,
    loginUser
}