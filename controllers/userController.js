let users = [
  {
    id: 1,
    name: "Ajdin",
    surname: "Dervic",
    mail: "ajdindervic@mail.com",
    city: "Sarajevo",
    password: "test123",
  },
  {
    id: 2,
    name: "Dzenana",
    surname: "Dervic",
    mail: "dzenanadervic@mail.com",
    city: "Sarajevo",
    password: "test456",
  },
];

// Prikaz svih korisnika
const getAllUsers = (req, res) => {
  res.json(users);
};

// Prikaz jednog korisnika po ID-u
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Korisnik nije pronađen." });
  }

  res.json(user);
};

// Registracija korisnika
const createUser = (req, res) => {
  const { name, surname, mail, city, password } = req.body;

  if (!name || !surname || !mail || !city || !password) {
    return res.status(400).json({ message: "Sva polja su obavezna." });
  }

  const newUser = {
    id: Date.now(),
    name,
    surname,
    mail,
    city,
    password,
  };

  users.push(newUser);

  res.status(201).json({
    message: "Registracija je uspješna.",
    user: newUser,
  });
};

// Ažuriranje korisnika
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Korisnik nije pronađen." });
  }

  const { name, surname, mail, city, password } = req.body;

  if (name) user.name = name;
  if (surname) user.surname = surname;
  if (mail) user.mail = mail;
  if (city) user.city = city;
  if (password) user.password = password;

  res.json({ message: "Korisnik je ažuriran.", user });
};

// Brisanje korisnika
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Korisnik nije pronađen." });
  }

  const deleted = users.splice(index, 1);

  res.json({
    message: "Korisnik je uspješno obrisan.",
    deleted: deleted[0],
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
