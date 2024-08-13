let rooms = {}; // Để lưu trữ thông tin phòng
let users = {}; // Để lưu trữ thông tin người chơi và phòng mà họ tham gia

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id);
    
        // socket.on('create_room', (roomID) => {
        //     if (users[socket.id]) {
        //         socket.emit('room_is_created', { msg: 'You have already created or joined a room.' });
        //         return;
        //     }
    
        //     if (!rooms[roomID]) {
        //         rooms[roomID] = {
        //             players: [{ id: socket.id, symbol: 'X' }], 
        //             playerCount: 1, 
        //             gameState: Array(20).fill(Array(20).fill(null)),
        //             currentPlayer: 'X'
        //         };
        //         users[socket.id] = roomID;
        //         socket.join(roomID);
        //         socket.emit('room_is_created', { msg: 'Room created successfully.', symbol: 'X' });
        //         io.emit('load_room', rooms);
        //     } else {
        //         socket.emit('room_is_created', { msg: 'Room already exists.' });
        //     }
        // });

        socket.on('create_room', (roomID) => {
            if (users[socket.id]) {
                socket.emit('room_is_created', { msg: 'You have already created or joined a room.' });
                return;
            }

            if (!rooms[roomID]) {
                rooms[roomID] = {
                    creator: socket.id, // Lưu ID của người tạo phòng
                    players: [{ id: socket.id, symbol: 'X' }],
                    playerCount: 1,
                    gameState: Array(20).fill(Array(20).fill(null)),
                    currentPlayer: 'X'
                };
                users[socket.id] = roomID;
                socket.join(roomID);
                socket.emit('room_is_created', { msg: 'Room created successfully.', symbol: 'X' , creator: rooms[roomID].creator});

                io.emit('load_room', rooms);
            } else {
                socket.emit('room_is_created', { msg: 'Room already exists.' });
            }
        });

    
        // socket.on('join_room', (roomID) => {
        //     if (users[socket.id]) {
        //         socket.emit('room_full', { msg: 'You are already in a room.' });
        //         return;
        //     }
    
        //     if (rooms[roomID]) {
        //         if (rooms[roomID].playerCount < 2) {
        //             const symbol = rooms[roomID].players[0].symbol === 'X' ? 'O' : 'X';
        //             rooms[roomID].players.push({ id: socket.id, symbol });
        //             rooms[roomID].playerCount++;
        //             users[socket.id] = roomID;
        //             socket.join(roomID);
        //             socket.emit('join_success', { msg: 'Joined room successfully.', symbol, gameState: rooms[roomID].gameState });
        //             io.to(roomID).emit('player_joined', { playerCount: rooms[roomID].playerCount, roomID });
        //         } else {
        //             socket.emit('room_full', { msg: 'Room is full.' });
        //         }
        //     } else {
        //         socket.emit('room_not_exist', { msg: 'Room does not exist.' });
        //     }
        // });

        socket.on('join_room', (roomID) => {
            if (users[socket.id]) {
                socket.emit('room_full', { msg: 'You are already in a room.' });
                return;
            }

            if (rooms[roomID]) {
                if (rooms[roomID].playerCount < 2) {
                    const symbol = rooms[roomID].players[0].symbol === 'X' ? 'O' : 'X';
                    rooms[roomID].players.push({ id: socket.id, symbol });
                    rooms[roomID].playerCount++;
                    users[socket.id] = roomID;
                    socket.join(roomID);
                    socket.emit('join_success', { 
                        msg: 'Joined room successfully.', 
                        symbol, 
                        gameState: rooms[roomID].gameState,
                        creator: rooms[roomID].creator // Gửi thông tin người tạo phòng
                    });
                    io.to(roomID).emit('player_joined', { playerCount: rooms[roomID].playerCount, roomID });
                } else {
                    socket.emit('room_full', { msg: 'Room is full.' });
                }
            } else {
                socket.emit('room_not_exist', { msg: 'Room does not exist.' });
            }
        });
    
        socket.on('make_move', ({ roomID, move }) => {
            const room = rooms[roomID];
            if (room) {
                const player = room.players.find(p => p.id === socket.id);
                if (player.symbol !== room.currentPlayer) {
                    socket.emit('not_your_turn', { msg: 'Not your turn!' });
                    return;
                }
                
                let newGameState = room.gameState.map(row => [...row]);
                newGameState[move.i][move.j] = player.symbol;
                room.gameState = newGameState;
                room.currentPlayer = player.symbol === 'X' ? 'O' : 'X';
                io.to(roomID).emit('receive_move', { i: move.i, j: move.j, symbol: player.symbol });
            }
        });

        socket.on('send_message', ({ roomID, message, sender }) => {
            // Phát tin nhắn tới tất cả các thành viên trong phòng
            io.to(roomID).emit('receive_message', { message, sender });
        });

        socket.on('restart_game', ({ roomID }) => {
            if (rooms[roomID]) {
                rooms[roomID].gameState = Array(20).fill(Array(20).fill(null));
                rooms[roomID].currentPlayer = 'X'; // Reset current player to X
                io.to(roomID).emit('restart_game'); // Notify all players to restart the game
            }
        });
    
        socket.on('leave_room', () => {
            let roomID = users[socket.id];
            if (roomID) {
                let room = rooms[roomID];
                room.players = room.players.filter(player => player.id !== socket.id);
                room.playerCount--;
    
                if (room.playerCount === 0) {
                    delete rooms[roomID];
                } else {
                    io.to(roomID).emit('player_left', { msg: 'Your opponent has left. You win!' });
                }
            }
    
            delete users[socket.id];
            io.emit('load_room', rooms);
        });
    
        socket.on('disconnect', () => {
            let roomID = users[socket.id];
            if (roomID) {
                let room = rooms[roomID];
                room.players = room.players.filter(player => player.id !== socket.id);
                room.playerCount--;
    
                if (room.playerCount === 0) {
                    delete rooms[roomID];
                } else {
                    io.to(roomID).emit('player_left', { msg: 'Your opponent has left. You win!' });
                }
            }
    
            delete users[socket.id];
            io.emit('load_room', rooms);
            console.log('A user disconnected: ', socket.id);
        });
    });
};
