const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const message = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Aditya')
    .setURL('https://github.com/haki-user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Provides information about the bot author.'),
    async execute(interaction) {
        await interaction.reply({ embeds: [ message ] });
    },
};