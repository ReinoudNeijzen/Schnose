const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const userSchema = require('../schemas/user-schema');
require('dotenv').config();
require('../functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bmaptop')
        .setDescription(`Check a bonus top 10 leaderboard.`)
        .addStringOption((o) => o.setName('map').setDescription('Select a Map.').setRequired(true))
        .addStringOption((o) =>
            o
                .setName('runtype')
                .setDescription('TP/PRO')
                .setRequired(false)
                .addChoice('TP', 'true')
                .addChoice('PRO', 'false')
        )
        .addStringOption((o) =>
            o
                .setName('mode')
                .setDescription('Select a Mode.')
                .setRequired(false)
                .addChoice('SKZ', 'SimpleKZ')
                .addChoice('KZT', 'KZTimer')
                .addChoice('VNL', 'Vanilla')
                .addChoice('ALL', 'All 3 Modes')
        )
        .addIntegerOption((o) =>
            o.setName('course').setDescription('Specify which BWR you want to check.')
        ),

    async execute(interaction) {
        await interaction.deferReply();
        let reply = '(͡ ͡° ͜ つ ͡͡°)';

        userSchema.findOne(async (err, data) => {
            if (err) return console.log(err);
            let output = interaction.options;
            let map = output.getString('map');
            let runtype = 'true' === output.getString('runtype');
            let penisMode = output.getString('mode' || null);
            let mode;
            let course = output.getInteger('course') || 1;

            async function answer(input) {
                await interaction.editReply(input);
            }

            let maps = await retard.getMaps();
            if (maps == 'bad') {
                //API side error
                reply = 'API Error! Please try again later.';
                answer({ content: reply });
                return;
            }
            if (!maps.includes(map)) {
                let i;
                for (i = 0; i < maps.length; i++) {
                    if (maps[i].includes(map)) {
                        map = maps[i];
                        break;
                    }
                }
                if (i == maps.length) {
                    reply = `\`${map}\` is not a valid map!`;
                    answer({ content: reply });
                    return;
                }
            }

            if (!penisMode) {
                //no specified mode
                if (!data.List[interaction.user.id]) {
                    //if target isnt registered in database
                    reply = `You either have to specify a mode or set a default mode using the following command:\n \`\`\`\n/mode\n\`\`\`.`;
                    answer({ content: reply });
                    return;
                }
                mode = data.List[interaction.user.id].mode;
                if (mode == 'kz_simple') penisMode = 'SimpleKZ';
                else if (mode == 'kz_timer') penisMode = 'KZTimer';
                else if (mode == 'kz_vanilla') penisMode = 'Vanilla';
                else if (mode == 'all') {
                    reply = 'Specify a mode';
                    return answer({ content: reply });
                }
            } else if (penisMode === 'SimpleKZ') mode = 'kz_simple';
            else if (penisMode === 'KZTimer') mode = 'kz_timer';
            else if (penisMode === 'Vanilla') mode = 'kz_vanilla';
            else {
                reply = 'Specify a mode';
                return answer({ content: reply });
            }

            let penisRuntype = 'PRO';
            if (runtype) {
                penisRuntype = 'TP';
            }

            let [Maptop] = await Promise.all([retard.getDataMaptop(runtype, mode, map, course)]);

            //console.log(Maptop);

            if (Maptop == 'bad') {
                reply = 'API Error! Please wait a moment before trying again.';
                answer({ content: reply });
                return;
            }
            if (Maptop == 'no data') {
                reply = 'API Error! Please wait a moment before trying again.';
                answer({ content: reply });
                return;
            }

            let times = [];
            let players = [];

            Maptop.forEach((i) => {
                if (i == undefined) {
                    times[i] = 'none';
                    players[i] = 'none';
                }
                times.push(retard.convertmin(i.time));
                players.push(i.player_name);
            });
            //console.log(times);
            //console.log(players);

            let embed = new MessageEmbed()
                .setColor('#7480c2')
                .setTitle(`${map} - BMaptop ${course}`)
                .setDescription(`Mode: ${penisMode} | Runtype: ${penisRuntype}`)
                .setThumbnail(
                    `https://raw.githubusercontent.com/KZGlobalTeam/map-images/master/images/${map}.jpg`
                )
                .addFields({ name: `[WR]  ${players[0]}`, value: `${times[0]}\n\u200B` })
                .addFields(
                    {
                        name: `[#2] ${players[1] || 'none'}`,
                        value: `${times[1] || '--:--'}`,
                        inline: true,
                    },
                    {
                        name: `[#3] ${players[2] || 'none'}`,
                        value: `${times[2] || '--:--'}`,
                        inline: true,
                    },
                    {
                        name: `[#4] ${players[3] || 'none'}`,
                        value: `${times[3] || '--:--'}`,
                        inline: true,
                    },
                    {
                        name: `[#5] ${players[4] || 'none'}`,
                        value: `${times[4] || '--:--'}`,
                        inline: true,
                    },
                    {
                        name: `[#6] ${players[5] || 'none'}`,
                        value: `${times[5] || '--:--'}`,
                        inline: true,
                    },
                    {
                        name: `[#7] ${players[6] || 'none'}`,
                        value: `${times[6] || '--:--'}`,
                        inline: true,
                    },
                    {
                        name: `[#8] ${players[7] || 'none'}`,
                        value: `${times[7] || '--:--'}`,
                        inline: true,
                    },
                    {
                        name: `[#9] ${players[8] || 'none'}`,
                        value: `${times[8] || '--:--'}`,
                        inline: true,
                    },
                    {
                        name: `[#10] ${players[9] || 'none'}`,
                        value: `${times[9] || '--:--'}`,
                        inline: true,
                    }
                )
                .setFooter({ text: '(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church', iconURL: process.env.JOE });
            return answer({ embeds: [embed] });
        });
    },
};