const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();


router.get("/", authenticateToken, async (req, res) => {

  try {
    const movies = await prisma.movie.findMany({
      where: {
        userId: req.user.userId
      }
    });

    res.json(movies);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
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

router.put("/:id", authenticateToken, async (req, res) => {

  try {
    const { id } = req.params;
    const { title, watched, rating } = req.body;

    const updatedMovie = await prisma.movie.update({
      where: {
        id: parseInt(id),
        userId: req.user.userId
      },
      data: {
        title,
        watched,
        rating
      }
    });

    res.json(updatedMovie);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) =>{
    try{
        const { id } = req.params;
        const { title } = req.body; 

        const deletedMovie = await prisma.movie.delete({
            where: {
                id: parseInt(id),
                userId: req.user.userId
            }
        });

        res.json(deletedMovie);
    } catch (error) {
    res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;