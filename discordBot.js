const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DC_BOT_TOKEN;
const CHANNEL = process.env.DC_BOT_CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.sendMessage = (msg) => {
  client.channels.fetch(CHANNEL).then(channel => {
    channel.send(msg);
  })
    .catch(console.error);
}

client.login(TOKEN);

module.exports = client
