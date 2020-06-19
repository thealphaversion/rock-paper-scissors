// append a message to the list of messages
const writeEvent = (text) => {
    const parent = document.querySelector("#events");
    const element = document.createElement("li");
    element.innerHTML = text;

    parent.appendChild(element);
};

const displaylinks = () => {
    const x = document.querySelector("#option");
    x.style.display = "block";
    const parent = document.querySelector("#buttons");
    parent.style.display = "none";
   
};

const displaybuttons = () => {
    const x = document.querySelector("#option");
    x.style.display = "none";
    const parent = document.querySelector("#buttons");
    parent.style.display = "block";
   
};



const socket = io();

// display messages
socket.on("message", function (data) {
    writeEvent(data);
});

socket.on("over", function () {
    displaylinks();
});

socket.on("restart", function () {
    displaybuttons();
});

// adding on click listeners to buttons
const addingListeners = () => {
    ["rock", "paper", "scissors"].forEach((id) => {
        document.getElementById(id).addEventListener("click", () => {
            socket.emit("turn", id);
        });
    });
};

const addingListeners2 = () => {
    ["same", "new", "end"].forEach((id) => {
        document.getElementById(id).addEventListener("click", () => {
            socket.emit("endgameoptions", id);
        });
    });
};

writeEvent("Welcome");
addingListeners();
addingListeners2();
