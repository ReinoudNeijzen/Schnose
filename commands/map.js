const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const userSchema = require("../schemas/user-schema");
require("dotenv").config();
require("../functions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("map")
        .setDescription("Get infomation about a map.")
        .addStringOption((o) => o.setName("map").setDescription("Select a map.").setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        let reply = "(͡ ͡° ͜ つ ͡͡°)";

        userSchema.findOne(async (err, data) => {
            if (err) return console.log(err);
            let output = interaction.options;
            let map = output.getString("map");

            async function answer(input) {
                await interaction.editReply(input);
            }

            let mapsmap = new Map();
            let maps = [];
            let maps2 = await retard.getMapsAPI();
            if (maps2 == "bad") {
                //API side error
                reply = "API Error! Please try again later.";
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

            let [penisSkz, penisKzt, penisVnl] = ["❌", "❌", "❌"];
            let [all, kzgo] = await Promise.all([
                retard.hasFilter(mapsmap.get(map), 0),
                retard.stealKZGOdata(),
            ]);
            if ([all, kzgo].includes("bad")) {
                answer({ content: "API Error. Please try again later." });
                return;
            }
            let skz, kzt, vnl;
            all.forEach((i) => {
                if (i.mode_id == 200) kzt = true;
                else if (i.mode_id == 201) skz = true;
                else if (i.mode_id == 202) vnl = true;
            });
            if (skz) penisSkz = "✅";
            if (kzt) penisKzt = "✅";
            if (vnl) penisVnl = "✅";

            for (let i = 0; i < kzgo.length; i++) {
                if (kzgo[i].name == map) {
                    kzgo = kzgo[i];
                    break;
                }
            }

            let date2 = new Date(Date.parse(kzgo.date));

            let date = `${date2.getDate().toString().padStart(2, "0")}/${date2
                .getMonth()
                .toString()
                .padStart(2, "0")}/${date2.getFullYear()}`;

            let embed = new MessageEmbed()
                .setColor("#7480c2")
                .setTitle(`${map}`)
                .setThumbnail(
                    `https://raw.githubusercontent.com/KZGlobalTeam/map-images/master/images/${map}.jpg`
                )
                .setURL(`https://kzgo.eu/maps/${map}`)
                .setDescription(
                    `> Tier: ${kzgo.tier}\n> Mapper: [${kzgo.mapper_name[0]}](https://steamcommunity.com/profiles/${kzgo.mapper_id64[0]})\n> Bonuses: ${kzgo.stages}\n> Globalled: \`${date}\`\n`
                )
                .addFields(
                    {
                        name: "SimpleKZ",
                        value: penisSkz,
                        inline: true,
                    },
                    {
                        name: "KZTimer",
                        value: penisKzt,
                        inline: true,
                    },
                    {
                        name: "Vanilla",
                        value: penisVnl,
                        inline: true,
                    }
                )
                .setFooter({
                    text: "(͡ ͡° ͜ つ ͡͡°)7 | workshopID: 2420807980 | schnose.eu/church",
                    iconURL: process.env.JOE,
                });

            return answer({ embeds: [embed] });
        });
    },
};
