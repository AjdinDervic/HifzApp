const express = require("express");
const app = express();


app.use(express.json());



const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("./routes/userRoutes");
const progressRoutes = require("./routes/progressRoutes");
const quoteRoutes = require("./routes/quoteRoutes");



app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quotes", quoteRoutes);

module.exports = app;
