// Registracija korisnika
const createUser = async (req, res) => {
  const { name, surname, email, city, password, userType } = req.body;

  if (!name || !surname || !email || !city || !password || !userType) {
    return res.status(400).json({ message: "Sva polja su obavezna." });
  }

  try {
    const user = await prisma.user.create({
      data: { name, surname, email, password, city, role: "USER", userType },
    });
    res.status(201).json({ message: "Registracija uspješna.", user });
  } catch (error) {
    res.status(500).json({ error: "Greška prilikom kreiranja korisnika." });
  }
};
