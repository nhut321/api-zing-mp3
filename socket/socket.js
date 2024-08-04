const Message = require('../Model/Message')

let onlineUsers = new Set();

module.exports = (io) => {
    // phat hien nguoi online
    io.on('connection', (socket) => {
    

        onlineUsers.add(socket.id);
    io.emit('updateOnlineUsers', onlineUsers.size);
    
        socket.on('sendMessage', async (message) => {
            const newMessage = new Message({text: message.text, user: message.user});
            await newMessage.save()
            // newMessage.save()
            io.emit('receiveMessage', message);
        });
    
        socket.on('disconnect', () => {
        onlineUsers.delete(socket.id); // Xóa người dùng khỏi danh sách khi ngắt kết nối
        io.emit('updateOnlineUsers', onlineUsers.size); // Cập nhật số lượng người dùng online
        });
    });
}