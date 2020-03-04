const io = require('socket.io')(3001);
const { User } = require('./models/user');

const activeUsers = {};
function startServer() {

    User.findById('5e5fa56fbf6e724b988cc687')
        // .select('chats')
        .populate({
            path: 'users',
            populate: {
                path: 'userId',
                model: 'users'
            }
        })
        .then(res => {
            console.log("Test >>", res);
        })


    io.on('connection', async socket => {
        console.log("New connection", socket.id);
        activeUsers[socket.handshake.query.userId] = socket.id;

        // socket.emit("chat-message", 'Salam!')

        // When user sent a message
        socket.on('send-message', data => {
            console.log(data);
            // socket.broadcast.emit('send-chat-message', data)

            function updateMessages(from, to) {
                User.findOne({ _id: to }).then(toUser => {

                    if (!toUser) {
                        console.log("User not found ", toUser, "ID:", to);
                        return;
                    }


                    const chats = toUser.chats;
                    let chat = chats.find(chat => chat.userId == socket.handshake.query.userId);

                    console.log(chat);
                    if (chat) {

                        // Update lastUpdated
                        chat.lastUpdated = Date.now();

                        // Update messages array
                        chat.messages.push({
                            direction: "from", message: data.message
                        })

                        // Save
                        toUser.save().then(res => {
                            // console.log("Saved >>>", res.chats.pop());
                        });
                    } else {
                        chats.push({
                            userId: from,
                            messages: [data.info],
                            lastUpdated: Date.now()
                        })
                        // console.log(toUser);

                        toUser.save().then(res => {
                            // console.log("Saved >>>", res);
                        });
                    }
                }).catch(err => {
                    console.log("Error !!!!", err);

                })
            }

            // add message to 'toUser'
            updateMessages(socket.handshake.query.userId, data.to);
            // update messages of 'fromUser
            updateMessages(data.to, socket.handshake.query.userId);

            // Send socket to user
            if (activeUsers[data.to]) {
                io.to(activeUsers[data.to]).emit('private-message', {
                    direction: "from", message: data.message, date: Date.now(), from: socket.handshake.query.userId
                })
            }
        })

        // Get chats 
        socket.on('get-chat-messages', data => {

            var chats;
            User.findById(socket.handshake.query.userId)
                .populate().then(user => {
                    console.log(user);

                    if (!user) {
                        console.log("User not found", socket.handshake.query.userId);
                        return;
                    }
                    // console.log("get-chat-messages", user);
                    chats = user.chats;
                    io.to(socket.id).emit('get-chat-messages', chats);
                });

        })

        // User connected (for online-status)
        // User disconnected (for online-status)
    })
}
module.exports = startServer;