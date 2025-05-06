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

  if (req.user.id !== parseInt(req.params.id) && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Nemaš pristup ovom korisniku." });
  }

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


// Ažuriranje korisnika
const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.id !== parseInt(req.params.id)) {
    return res
      .status(403)
      .json({ message: "Možeš uređivati samo svoj profil." });
  }

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
  updateUser,
  deleteUser,
};
