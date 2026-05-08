require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const profileRoutes = require("./routes/profile");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Movie Watchlist API is running");
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/profile", profileRoutes);

app.listen(3001, () => {
    console.log("Server running on port 3001");
});