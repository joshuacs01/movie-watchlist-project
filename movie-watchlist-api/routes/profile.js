const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();


//user profile
router.get("/profile", authenticateToken, async (req, res) => {

    try {
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
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        })
    }

});

module.exports = router;