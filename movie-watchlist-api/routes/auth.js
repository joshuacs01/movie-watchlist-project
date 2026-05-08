
const express = require("express");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router= express.Router();

//encryption
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/auth/register", async (req, res) => {

  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    res.json({
      message: "User created",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    })
  }

});

//login
router.post("/auth/login", async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
}

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    })
  }
});

module.exports = router;