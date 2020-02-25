const io = require('socket.io')(3001);

function startServer() {
    io.on('connection', socket => {
        console.log("New connection", socket.id);

        // socket.emit("chat-message", 'Salam!')

        // When user sent a message
        socket.on('send-chat-message', message => {
            console.log(message);
            socket.broadcast.emit('send-chat-message', message)
        })


        // User connected (for online-status)
        // User disconnected (for online-status)
    })
}
module.exports = startServer;