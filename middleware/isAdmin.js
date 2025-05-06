const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Pristup dozvoljen samo adminima." });
  }
  next();
};

module.exports = isAdmin;
