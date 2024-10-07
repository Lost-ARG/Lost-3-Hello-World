const socket = io();

socket.on("readChip/present", args => {
  location.href = args["url"];
})
