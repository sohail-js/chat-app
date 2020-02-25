
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


router.post('/register', async (req, res) => {
    try {
        // If username exists
        // if(await User.find({ username: req.body.username })){
        //     res.status(400).json({ success: })
        // }

        const password = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password,
        })

        const newUser = await user.save();
        res.status(201).json({ success: true, message: "Registration success!", data: newUser });
    } catch (err) {
        res.status(400).json({ success: false, message: "Unable to register", data: err.message })
    }
})

// Search users
router.get('/search/:q', async (req, res) => {
    // res.send("Salam");
    // console.log(req);
    try {
        const usersList = await User.find({
            $or: [
                { username: new RegExp(req.params.q, "i") },
                { name: new RegExp(req.params.q, "i") }
            ]
        }, 'username name');
        res.json(usersList)
    } catch (err) {
        res.status(500).json({ data: err.message })
    }
})

// // Getting all
// router.get('/', async (req, res) => {
//     // res.send("Salam");
//     // console.log(req);
//     try {
//         const usersList = await User.find();
//         res.json(usersList)
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// })

// // Get one
// router.get('/:id', getUser, (req, res) => {
//     res.json(res.user);
// })

// // Create one
// router.post('/', async (req, res) => {
//     const user = new User({
//         name: req.body.name
//     })
//     try {
//         const newUser = await user.save();
//         res.status(201).json(newUser);
//     } catch (err) {
//         res.status(400).json({ message: err.message })
//     }
// })

// // Update one
// router.patch('/:id', getUser, async (req, res) => {
//     if (req.body.name != null) {
//         res.user.name = req.body.name
//     }
//     try {
//         const updatedUser = await res.user.save()
//         res.json(updatedUser)
//     } catch (err) {
//         res.status(400).json({ message: err.message })
//     }
// })

// // Delete one
// router.delete('/:id', getUser, async (req, res) => {
//     try {
//         await res.user.remove();
//         res.json({ message: "Deleted the user!" })
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// })

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Cannot find user" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user;
    next();
}

module.exports = router;