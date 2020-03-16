const io = require('socket.io')(3001);
const { User } = require('./models/user');

const activeUsers = {};
const gameSessions = {};
const gameData = {};

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
                // .sort([['chats.lastUpdated', 1]])
                .populate('chats.user', 'name username')
                .then(user => {
                    // console.log(user.chats);

                    if (!user) {
                        console.log("User not found", userId);
                        return;
                    }
                    // console.log("get-chat-messages", user);

                    // Sort
                    chats = user.chats.sort((a, b) => b.lastUpdated - a.lastUpdated);
                    io.to(activeUsers[userId]).emit('get-chat-messages', chats);
                });
        }

        /**
         * @desc Send message to user
         * @param {*} data 
         */
        function sendMessage(data) {
            // console.log("send-message", data);
            // socket.broadcast.emit('send-chat-message', data)

            function updateMessages(from, to, direction) {
                User.findOne({ _id: to }).then(toUser => {

                    if (!toUser) {
                        console.log("User not found ", toUser, "ID:", to);
                        return;
                    }

                    const chats = toUser.chats;
                    let chat = chats.find(chat => chat.user == from);

                    // console.log("Chat", chat);

                    if (!chat) {
                        // Create new chat
                        chat = {
                            user: from,
                            messages: [{
                                direction, message: data.message
                            }],
                            unReadCount: direction == "from" ? 1 : 0,
                            lastUpdated: Date.now()
                        };
                        toUser.chats.push(chat);
                    } else {

                        // Update messages array
                        chat.messages.push({
                            direction, message: data.message
                        })

                        // Update lastUpdated
                        chat.lastUpdated = Date.now();

                        if (direction == "from")
                            chat.unReadCount++;
                    }


                    // console.log(toUser.chats);


                    toUser.save().then(res => {
                        // console.log("Saved 2 >>>", res);
                        if (direction == "from") {
                            // Send updated messages to user
                            sendChatMessagesToUser(to);
                        }
                    });
                }).catch(err => {
                    console.log("Error !!!!", err);
                })
            }

            // add message to 'toUser'
            updateMessages(socket.handshake.query.userId, data.to, "from");
            // console.log("toUser");

            // update messages of 'fromUser
            updateMessages(data.to, socket.handshake.query.userId, "to");
            // console.log("fromUser");

            // if (activeUsers[data.to]) {
            //     io.to(activeUsers[data.to]).emit('private-message', {
            //         direction: "from", message: data.message, date: Date.now(), from: socket.handshake.query.userId
            //     })
            // }

        }
        console.log("New connection", socket.id);
        activeUsers[socket.handshake.query.userId] = socket.id;

        // socket.emit("chat-message", 'Salam!')

        // When user sends a message
        socket.on('send-message', sendMessage);

        // When user reads a message
        socket.on('message-read', data => {
            User.findById(socket.handshake.query.userId).then(res => {
                res.chats.find(chat => chat._id == data.chatId).unReadCount = 0;
                res.save().then(res => {
                    console.log("message-read updated");
                });
            })
        })

        // Get chats 
        socket.on('get-chat-messages', data => {
            sendChatMessagesToUser(socket.handshake.query.userId);
        })

        // User connected (for online-status)
        // User disconnected (for online-status)

        /**
         * GAME
         */


        // Join Game
        socket.on('game', data => {
            switch (data.name) {
                case 'tic-tac-toe':
                    // Check if game exists
                    // if (gameSessions[socket.handshake.query.userId] && gameSessions[socket.handshake.query.userId].opponent == data.to) {

                    // Create new game
                    if (data.action == 'create') {
                        // Create game
                        gameSessions[data.sessionId] = { creator: socket.handshake.query.userId, opponent: data.to };

                        // Send message to opponent
                        sendMessage({
                            message: `Hey! lets play a game :D
                            Join my game <a href="http://localhost:4200/game/${data.sessionId}/tic-tac-toe">here</a> `,
                            to: data.to
                        })
                        console.log("game created");
                    }
                    // Join existing game
                    else if (data.action == 'join') {
                        let currentSession = gameSessions[data.sessionId];
                        if (gameSessions[data.sessionId]) {

                            if (currentSession.creator == socket.handshake.query.userId) {
                                // Send response to creator
                                io.to(activeUsers[gameSessions[data.sessionId].creator]).emit('game-move', {
                                    action: 'created'
                                });
                                return;
                            }

                            // Send response to creator
                            io.to(activeUsers[gameSessions[data.sessionId].creator]).emit('game-move', {
                                action: 'accepted'
                            });

                            // // Send response to opponent
                            // io.to(activeUsers[data.to]).emit('game-move', {
                            //     action: 'gameSession', sessionData: gameSession[socket.handshake.query.userId]
                            // });
                            console.log("challenge accepted");
                        }
                        else {
                            console.log('Game does not exists');
                        }
                    }
            }
        })

        function checkWinner(board) {

            // horizontal
            for (let i = 0; i < 3; i++) {
                if (board[i][0] == board[i][1] && board[i][0] == board[i][2]) {
                    return board[i][0]
                }
            }

            // vertical
            for (let i = 0; i < 3; i++) {
                if (board[0][i] == board[1][i] && board[0][i] == board[2][i]) {
                    return board[0][i]
                }
            }

            // diagonal
            if (board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
                return board[0][0];
            }
            else if (board[2][0] == board[1][1] && board[2][0] == board[0][2]) {
                return board[2][0];
            }

            return null;
        }
        // Game move
        socket.on('game-move', data => {
            switch (data.action) {
                case 'move':
                    console.log('Move', gameSessions, data.sessionId);
                    if (!gameSessions[data.sessionId].gameData) {
                        gameSessions[data.sessionId].gameData = [[], [], []]
                    }
                    gameSessions[data.sessionId].gameData[data.move.x][data.move.y] = socket.handshake.query.userId == gameSessions[data.sessionId].creator ? 'X' : 'O';

                    let gameData = {
                        action: 'gameSession', sessionData: gameSessions[data.sessionId].gameData
                    };

                    let winner = checkWinner(gameSessions[data.sessionId].gameData);

                    if (winner) {
                        gameData = {
                            action: 'gameOver', winner: winner == 'X' ? gameSessions[data.sessionId].creator : gameSessions[data.sessionId].opponent
                        }
                    }

                    // Send updated game data to both the users
                    io.to(activeUsers[gameSessions[data.sessionId].creator]).emit('game-move', gameData);
                    io.to(activeUsers[gameSessions[data.sessionId].opponent]).emit('game-move', gameData);
                    console.log("sent game data");

                    break;
            }
        })
    })
}
module.exports = startServer;