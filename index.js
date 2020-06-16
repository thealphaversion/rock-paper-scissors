const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const GameMechanincs = require("./mechanincs");

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.json());
app.use("/static", express.static(__dirname + "/static"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./ui/index.html"));
});

// initializing player waiting for another one
let waiting_player = null;

// when a player is connected
io.on("connection", (socket) => {
    // if there is already a player waiting
    if (waiting_player) {
        new GameMechanincs(waiting_player, socket);
        waiting_player = null;
    } else {
        // if no player is waiting then you have to wait
        waiting_player = socket;
        waiting_player.emit("message", "Waiting for an opponent");
    }

    // emit message to current player
    socket.on("message", (text) => {
        // emit message to both players
        io.emit("message", text);
    });
});

const port = process.env.PORT || 3000;

server.on("error", (err) => {
    console.log("Server error: ", err);
});

server.listen(port, () => console.log(`Listening on port ${port}...`));
