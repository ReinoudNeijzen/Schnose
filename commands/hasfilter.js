const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const userSchema = require('../schemas/user-schema');
require('dotenv').config();
require('../functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hasfilter')
        .setDescription("Check a map's global record filters.")
        .addStringOption((o) => o.setName('map').setDescription('Select a map.').setRequired(true))
        .addIntegerOption((o) =>
            o.setName('course').setDescription('Specify a course.').setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        let reply = '(͡ ͡° ͜ つ ͡͡°)';

        userSchema.findOne(async (err, data) => {
            if (err) return console.log(err);
            let output = interaction.options;
            let map = output.getString('map');
            let course = output.getInteger('course') | 0;

            async function answer(input) {
                await interaction.editReply(input);
            }

            let mapsmap = new Map();
            let maps = [];
            let maps2 = await retard.getMapsAPI();
            if (maps2 == 'bad') {
                //API side error
                reply = 'API Error! Please try again later.';
                answer({ content: reply });
                return;
            }
            maps2.forEach((i) => {
                maps.push(i.name);
                mapsmap.set(i.name, i.id);
            });
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

            let [penisSkz, penisKzt, penisVnl] = ['❌', '❌', '❌'];
            let [skz, kzt, vnl] = await Promise.all([
                retard.hasFilter(mapsmap.get(map), 'kz_simple', course),
                retard.hasFilter(mapsmap.get(map), 'kz_timer', course),
                retard.hasFilter(mapsmap.get(map), 'kz_vanilla', course),
            ]);
            if ([skz, kzt, vnl].includes('bad')) {
                answer({ content: 'API Error. Please try again later.' });
                return;
            }
            if (skz) penisSkz = '✅';
            if (kzt) penisKzt = '✅';
            if (vnl) penisVnl = '✅';

            let title;
            if (course > 0) {
                title = `${map} - Filters [B${course}]`;
            } else title = `${map} - Filters`;

            reply = new MessageEmbed()
                .setColor('#7480c2')
                .setTitle(`${title}`)
                .setThumbnail(
                    `https://raw.githubusercontent.com/KZGlobalTeam/map-images/master/images/${map}.jpg`
                )
                .addFields(
                    {
                        name: 'SimpleKZ',
                        value: `${penisSkz}`,
                        inline: true,
                    },
                    {
                        name: 'KZTimer',
                        value: `${penisKzt}`,
                        inline: true,
                    },
                    {
                        name: 'Vanilla',
                        value: `${penisVnl}`,
                        inline: true,
                    }
                )
                .setFooter({
                    text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                    iconURL: process.env.JOE,
                });

            return answer({ embeds: [reply] });
        });
    },
};
