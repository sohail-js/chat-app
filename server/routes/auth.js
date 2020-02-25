
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
    try {
        // Authenticate user

        const [user] = await User.find(
            {
                username: req.body.username,
                // password: hashedPassword
            }
            // , "_id username name"
        );
        if (!user) {
            res.status(400).json({ success: false, message: "username does not exists" })
        }

        // console.log("User >>>", user);
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Return accessToken

            const accessToken = jwt.sign({ username: user.username, name: user.name }, process.env.ACCESS_TOKEN_SECRET);

            res.status(200).json({
                success: true, data: {
                    username: user.username,
                    name: user.name,
                    accessToken
                }
            });
        }
        else {
            res.status(400).json({ success: false, message: "Invalid username or password." })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to login", data: error.message })
    }

})

module.exports = router;