require("dotenv").config();
const express = require("express");
const db = require("./src/db"); // Import kết nối MySQL từ db.js
const authroutes = require("./src/routes/authRoutes");

const app = express();
app.use(express.json());
app.use("/api", authroutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
