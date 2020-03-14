const io = require('socket.io')(3001);
const { User } = require('./models/user');

const activeUsers = {};

function startServer() {


    // User
    //     .find()
    //     .populate('chats.user')
    //     .then(res => {
    //         console.log("Test >>", res);
    //         console.log("Test >>", res[0].chats);
    //     })


    io.on('connection', async socket => {
        function sendChatMessagesToUser(userId) {
            var chats;
            return User.findById(userId)
                .populate('chats.user', 'name username')
                .then(user => {
                    console.log(user.chats);

                    if (!user) {
                        console.log("User not found", userId);
                        return;
                    }
                    // console.log("get-chat-messages", user);
                    chats = user.chats;
                    io.to(activeUsers[userId]).emit('get-chat-messages', chats);
                });
        }
        console.log("New connection", socket.id);
        activeUsers[socket.handshake.query.userId] = socket.id;

        // socket.emit("chat-message", 'Salam!')

        // When user sends a message
        socket.on('send-message', data => {
            console.log("send-message", data);
            // socket.broadcast.emit('send-chat-message', data)

            function updateMessages(from, to, direction) {
                User.findOne({ _id: to }).then(toUser => {

                    if (!toUser) {
                        console.log("User not found ", toUser, "ID:", to);
                        return;
                    }

                    const chats = toUser.chats;
                    let chat = chats.find(chat => chat.user == from);

                    console.log("Chat", chat);
                    if (chat) {

                        // Update lastUpdated
                        chat.lastUpdated = Date.now();

                        // Update messages array
                        chat.messages.push({
                            direction, message: data.message
                        })

                        // Save
                        toUser.save().then(res => {
                            // console.log("Saved 1 >>>", res);
                            if (direction == "from") {
                                // Send updated messages to user
                                sendChatMessagesToUser(to);
                            }
                        });
                    } else {
                        chats.push({
                            user: from,
                            messages: [{
                                direction,
                                message: data.message
                            }],
                            lastUpdated: Date.now()
                        })
                        // console.log(toUser);

                        toUser.save().then(res => {
                            // console.log("Saved 2 >>>", res);
                            if (direction == "from") {
                                // Send updated messages to user
                                sendChatMessagesToUser(to);
                            }
                        });
                    }
                }).catch(err => {
                    console.log("Error !!!!", err);
                })
            }

            // add message to 'toUser'
            updateMessages(socket.handshake.query.userId, data.to, "from");
            console.log("toUser");

            // update messages of 'fromUser
            updateMessages(data.to, socket.handshake.query.userId, "to");
            console.log("fromUser");

            // if (activeUsers[data.to]) {
            //     io.to(activeUsers[data.to]).emit('private-message', {
            //         direction: "from", message: data.message, date: Date.now(), from: socket.handshake.query.userId
            //     })
            // }
        })

        // When user reads a message
        socket.on('message-read', data => {
            User.findById(socket.handshake.query.userId).then(res => {
                res.chats.find(chat => chat._id == data.chatId).unReadCount = 0;
                res.save();
            })
        })

        // Get chats 
        socket.on('get-chat-messages', data => {
            sendChatMessagesToUser(socket.handshake.query.userId);
        })

        // User connected (for online-status)
        // User disconnected (for online-status)
    })
}
module.exports = startServer;