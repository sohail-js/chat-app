const mongoose = require('mongoose');

const Message = new mongoose.Schema({
    direction: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    isRead: { type: Boolean, required: true, default: false },
    type: { type: String, required: true, default: "message" }
})

const Chat = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    messages: [Message],
    lastUpdated: { type: Date, required: true }
});

const User = mongoose.model('users', new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    registeredOn: { type: Date, required: true, default: Date.now() },
    password: { type: String, required: true },
    chats: [Chat]
    // chats: new mongoose.Collection({

    // })
}));


module.exports.User = User;
// module.exports.Chat = Chat;
// module.exports.Message = Message;