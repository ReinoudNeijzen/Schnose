const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { JOE1, JOE2 } = require('../../variables.json');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('Help!'),
    async execute(interaction) {
        let penisJoe;
        let whichJoe = Math.random() < 0.5;
        if (whichJoe == true) penisJoe = JOE1;
        if (whichJoe == false) penisJoe = JOE2;

        try {
            const embed = new MessageEmbed()
                .setColor('#7480c2')
                .setDescription(
                    '**(͡ ͡° ͜ つ ͡͡°)/**\n\nUse the menu below for help with specific command.\nIf you find any bugs or have any ideas for new features / improving existing ones, __*please*__ message AlphaKeks#7480c2.'
                )
                .setFooter({ text: '(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church', iconURL: penisJoe });

            const commandMenu = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('commands-menu')
                    .setPlaceholder('Please select a category.')
                    .addOptions(
                        {
                            label: `/setsteam`,
                            description: `Set your steamID.`,
                            value: `setsteam-value`,
                        },
                        {
                            label: `/mode`,
                            description: `Set your preferred mode.`,
                            value: `mode-value`,
                        },
                        {
                            label: `/invite`,
                            description: `Invite the bot to your server.`,
                            value: `invite-value`,
                        },
                        {
                            label: `/pb`,
                            description: `Check your PB on a map.`,
                            value: `pb-value`,
                        },
                        {
                            label: `/wr`,
                            description: `Check a map's WR.`,
                            value: `wr-value`,
                        },
                        {
                            label: `/maptop`,
                            description: `Check a map's top 10 leaderboard.`,
                            value: `maptop-value`,
                        },
                        {
                            label: `/bpb`,
                            description: `Check your BPB on a map.`,
                            value: `bpb-value`,
                        },
                        {
                            label: `/bwr`,
                            description: `Check a map's BWR.`,
                            value: `bwr-value`,
                        },
                        {
                            label: `/bmaptop`,
                            description: `Check a bonus top 10 leaderboard.`,
                            value: `bmaptop-value`,
                        },
                        {
                            label: `/recent`,
                            description: `Check someone's most recent PB.`,
                            value: `recent-value`,
                        },
                        {
                            label: `/top`,
                            description: `Check who is currently holding the most WRs.`,
                            value: `top-value`,
                        },
                        {
                            label: `/profile`,
                            description: `Check your KZ Profile.`,
                            value: `profile-value`,
                        },
                        {
                            label: `/unfinished`,
                            description: `Check which maps you still need to finish.`,
                            value: `unfinished-value`,
                        },
                        {
                            label: `/hasfilter`,
                            description: `Check a map's global record filters.`,
                            value: `hasfilter-value`,
                        },
                        {
                            label: `/map`,
                            description: `Get detailed information on a map.`,
                            value: `map-value`,
                        },
                        {
                            label: `/nocrouch`,
                            description: `Forgot to crouch on an LJ? No Problem!`,
                            value: `nocrouch-value`,
                        }
                    )
            );

            answer({ embeds: [embed], components: [commandMenu], ephemeral: true });

            async function answer(input) {
                await interaction.reply(input);
            }
        } catch (err) {
            console.log(err);
            reply = `Command: ${__filename}\nServer: ${interaction.guild.name} | ${interaction.guild.id}\nUser: ${interaction.user.tag} | ${interaction.user.id}\nChannel: ${interaction.channel.name} | ${interaction.channel.id}`;
            console.log(reply);
            return;
        }
    },
};
