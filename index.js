const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const PORT = process.env.PORT || 8080;
const cors = require("cors");
require("dotenv").config();
require("./initDB")();

//io
const io = socketIo(server, {
  cors: {
    origin: [
      "https://gianglethuylinh.site",
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "https://nhaccuatoy.site",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: [
      "https://gianglethuylinh.site",
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "https://nhaccuatoy.site",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Import và cấu hình Socket.IO
require("./socket/socket")(io);

// Routes
const musicRouter = require("./Router/music");
const searchRouter = require("./Router/search");
const accountRouter = require("./Router/account");
const commentRouter = require("./Router/comment");
const listMusicRouter = require("./Router/list-music");
const favoriteRouter = require("./Router/favorite");
const playHistoryRouter = require("./Router/play-history");
const messageRouter = require("./Router/message");
const roomRouter = require('./Router/room')

app.use("/api/music", musicRouter);
app.use("/api/search", searchRouter);
app.use("/api/account", accountRouter);
app.use("/api/comment", commentRouter);
app.use("/api/list-music", listMusicRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/play-history", playHistoryRouter);
app.use("/api/messages", messageRouter);
app.use('/api/rooms', roomRouter)

app.get("/", (req, res) => {
  res.json({
    title: "Tâm sự của Nhựt: ",
    Message:
      "Tôi biết cậu sẽ không bao giờ đọc được cái này đâu, nhưng tôi muốn nói là: 'Lin ơi, anh yêu em!!! ❤️❤️❤️'",
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
