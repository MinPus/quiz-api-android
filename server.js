// File: server.js
require("dotenv").config();
const express = require("express");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(express.json());
app.use("/api", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
