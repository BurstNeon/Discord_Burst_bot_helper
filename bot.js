// require fs for command folder
const fs = require('fs');
//config file
const { prefix, token} = require('./config');
//discord.js stuff
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

//load commands
const commandFiles = fs.readdirSync('./commands');

//set playing
var playing = `Say -commands`;

//date and time setup
var date = new Date();
var hour = date.getHours();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//connect to discord api
client.on('ready', () => {
  console.log('I am ready!');
  console.log('started in ' + process.uptime() + 'secconds');
  console.log('The curent time in 24 hour is  ' + hour);
  console.log(`Ready to begin! Shard serving in ${client.guilds.size} servers`);
  client.user.setGame(playing);
});

//Look at messages to see if their is a command
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);
	if (command.args && !args.length) {
		return message.channel.send(`You did supply any arguments, ${message.author}`);
	}

	try {
		//exec command
		command.execute(message, args);
		//Log command
		console.log(command);
	}
	catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command! Please report this to the bot creater!');
	}
});

//bot login
client.login(token);

console.log('Bot.js done loading');
console.log('Bot.js Loaded in ' + process.uptime());