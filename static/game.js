// append a message to the list of messages
const writeEvent = (text) => {
    const parent = document.querySelector("#events");
    const element = document.createElement("li");
    element.innerHTML = text;

    parent.appendChild(element);
};

const socket = io();

// display messages
socket.on("message", function (data) {
    writeEvent(data);
});

// adding on click listeners to buttons
const addingListeners = () => {
    ["rock", "paper", "scissors"].forEach((id) => {
        document.getElementById(id).addEventListener("click", () => {
            socket.emit("turn", id);
        });
    });
};

writeEvent("Welcome");
addingListeners();
