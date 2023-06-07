const fs = require('node:fs');
const path = requier('node:path');
// discord classes 
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance 
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readFileSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = requier(filePath);
    // Set a new item in collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.command.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    } 

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});
// when the client is ready, run this code once
// we use 'c' for the event parameter to keep it separeate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready ! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token

const TOKEN = process.env.TOKEN
