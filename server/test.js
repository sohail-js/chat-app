function doSome() {
    var toUser = { chats: [] }; debugger;
    const chats = toUser.chats;
    let chat = chats.find(chat => chat.user == 1);

    console.log("Chat", chat);

    if (!chat) {
        // Create new chat
        chat = {
            user: 123,
            messages: [],
            unReadCount: 0,
            lastUpdated: Date.now()
        };
        toUser.chats.push(chat);
    }

    // Update messages array
    chat.messages.push({
        direction: 'from', message: 'testing'
    })

    // Update lastUpdated
    chat.lastUpdated = new Date();

    chat.unReadCount++;

    console.log(toUser.chats);
}

doSome();