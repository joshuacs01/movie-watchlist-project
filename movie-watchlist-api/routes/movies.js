const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();


//movies get and post
router.get("/", async (req, res) => {

  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    })
  }

});

router.post("/", authenticateToken, async (req, res) => {

  try {
    const { title } = req.body;
    const userId = req.user.userId;

    const movie = await prisma.movie.create({
      data: {
        title,
        userId
      }
    });

    res.json(movie);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    })
  }

});

module.exports = router;