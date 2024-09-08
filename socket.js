
const { Server } = require('socket.io');
const { findTeam } = require('./service/database/teamService');
const io = new Server();
const socket = {
  io: io
};

io.on("connection", (socket) => {
  console.log('socket connected successfully');
  socket.on('get-team-info', async (arg) => {
    try {
      const teams = await findTeam();
      socket.emit('team-info', teams)
    } catch (error) {
      console.error(error);
    }
  })
})

module.exports = socket;
