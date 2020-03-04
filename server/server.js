require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const socket = require('./socket');
const cors = require('cors');

// Start chat server
socket();

// Connect to mongodb
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;


// JSON
app.use(express.json());
app.use(cors());

// Route: /users
const users = require('./routes/users');
app.use('/users', users);

// Route: /auth
const auth = require('./routes/auth');
app.use('/auth', auth);

// Start server
app.listen(3000, () => { console.log("Server started."); });