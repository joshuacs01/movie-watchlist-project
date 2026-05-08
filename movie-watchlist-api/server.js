const { PrismaClient } = require("@prisma/client");

const express = require("express");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();


//encryption
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Movie Watchlist API is running");
});


//movies get and post
app.get("/movies", async (req, res) => {

  const movies = await prisma.movie.findMany();

  res.json(movies);
});

app.post("/movies", async (req, res) => {

  const { title, userId } = req.body;

  const movie = await prisma.movie.create({
    data: {
      title,
      userId
    }
  });

  res.json(movie);
});

//registration
app.post("/auth/register", async (req, res) => {

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
});

//login
app.post("/auth/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
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
});


//middlware
function authenticateToken(req, res, next) {

  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;

    next();
  });
}

//user profile
app.get("/profile", authenticateToken, async (req, res) => {

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId
    }
  });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email
  });
});


app.listen(3001, () => {
  console.log("Server running on port 3001");
});
