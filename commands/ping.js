import { SlashCommandBuilder } from 'discord.js';

module.exporst = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with poing!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};