const express = require('express');
const router = express.Router();

let rooms = {};

router.get('/', (req, res) => {
    res.json(Object.keys(rooms).map(id => ({ id })));
});

router.post('/', (req, res) => {
    const roomId = `room-${Date.now()}`;
    rooms[roomId] = { players: [], currentPlayer: null };
    res.json({ id: roomId });
});

module.exports = router;
