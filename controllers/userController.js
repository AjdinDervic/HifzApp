const prisma = require('../db/prisma');

// Prikaz svih korisnika
const getAllUsers = async (req, res) => {
 try{
    const users = await prisma.user.findMany();
    res.json(users);
 }catch(error){
console.error(error);
res.status(500).json({error: "Desilo se nesto neocekivano"});
 }
};

// Prikaz jednog korisnika po ID-u
const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try{
  const user = await prisma.user.findUnique({where: {id}});

  if (!user) {
    return res.status(404).json({ message: "Korisnik nije pronađen." });
  }
  res.json(user);
}catch(error){
console.log(error);
res.status(500).json({error: "Greska prilikom pronalska korisnika"});
}
};

// Registracija korisnika
const createUser = async (req, res) => {
  const { name, surname, email, city, password, userType } = req.body;

  if (!name || !surname || !email || !city || !password || !userType) {
    return res.status(400).json({ message: "Sva polja su obavezna." });
  }

  try{
    const user = await prisma.user.create({
        data: {name, surname, email, password, city, role: "USER", userType }
    });
    res.status(201).json({message: "Registracija uspješna.", user});
  }catch(error){
    res.status(500).json({error: "Greška prilikom kreiranja korisnika."});
  }

};

// Ažuriranje korisnika
const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
const { name, surname, email, password, city, userType } = req.body;
  try{
    const updated = await prisma.user.update({
      where: {id},
      data: {name, surname, email, password, city, userType}
    });
    res.json({message: "Podaci su ažuririrani.", user: updated});
  }catch(error){
    console.error(error);
    res.status(500).json({error: "Greška prilikom ažuriranja podataka"});
  }
};

// Brisanje korisnika
const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try{
  const deleted = await prisma.user.delete({where: {id}});
  res.json({ message: "Korisnik je izbrisan.", user: deleted });
  }catch(error){
    console.error(error);
    res.status(500).json({error: "Greška prilikom brisanja korisnika."});
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
