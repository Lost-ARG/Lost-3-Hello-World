const socket = io();

socket.on("readChip/absent", args => {
  location.href = args["url"];
})
