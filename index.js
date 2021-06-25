const Discord = require('discord.js'); console.log('Starting....')
const client = new Discord.Client();
const config = require('./config.json')
const reqEvent = (event) => require(`./Events/${event}.js`);

client.login(config.token)

client.on('ready', () => reqEvent('ready-web')(client));

client.on('message', async (message) => {
  // Evento message, caso queira colocar coisa no bot
});


