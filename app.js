const fs = require('node:fs');
const path = require('node:path');
// discord classes 
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
// const { token } = require('./config.json');
const TOKEN = process.env.TOKEN;

// Create a new client instance 
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
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
client.once(Events.ClientReady, async (c) => {
    try {
        const myGenChannel = await client.channels.fetch('865644813953400853');
        await myGenChannel.send("I'm live..");
        console.log(`Ready ! Logged in as ${c.user.tag}`);
    } catch (error) {
        console.log("Can't start");
        console.log(error);
    }
});

// Log in to Discord with your client's token
client.login(TOKEN);