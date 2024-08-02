const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const cors = require("cors");
require("dotenv").config();
require("./initDB")();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const musicRouter = require("./Router/music");
const searchRouter = require("./Router/search");
const accountRouter = require("./Router/account");
const commentRouter = require("./Router/comment");
const listMusicRouter = require("./Router/list-music");
const favoriteRouter = require("./Router/favorite");
const playHistoryRouter = require("./Router/play-history");

app.use("/api/music", musicRouter);
app.use("/api/search", searchRouter);
app.use("/api/account", accountRouter);
app.use("/api/comment", commentRouter);
app.use("/api/list-music", listMusicRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/play-history", playHistoryRouter);

app.get('/', (req, res) => {
    res.json({ GitHub: "Xin Chao, xem API phai khong" });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
