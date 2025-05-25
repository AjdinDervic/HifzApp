const express = require("express");

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());



const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("./routes/userRoutes");
const progressRoutes = require("./routes/progressRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const authRoutes = require("./routes/authRoutes");



app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
