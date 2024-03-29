// Package Imports
const { REST } = require('@discordjs/rest');
const { Collection, MessageEmbed } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const { botOwner, testGuildID, mode, JOE1, JOE2 } = require('../variables.json');
require('../globalFunctions');

async function commandReg(client) {
    const commands = [];
    const commandList = [];
    let devCommands = [];
    const suffix = '.js';
    const commandFiles = globalFunctions.getFiles(`${process.cwd()}/commands`, suffix);

    client.commands = new Collection();

    for (const command of commandFiles) {
        let commandFile = require(command);
        if (commandFile.default) commandFile = commandFile.default;
        if (commandFile.devOnly === true) devCommands.push(commandFile.data.name);

        // Developement Mode
        if (mode === 'DEV') {
            commands.push(commandFile.data.toJSON());
            commandList.push(commandFile.data.name);
            client.commands.set(commandFile.data.name, commandFile);
            //console.log(commands);
        }
        // Deploy Mode
        else if (mode === 'PROD') {
            if (commandFile.devOnly === false) {
                commands.push(commandFile.data.toJSON());
                commandList.push(commandFile.data.name);
                client.commands.set(commandFile.data.name, commandFile);
                //console.log(commands);
            }
        }
        // Incorrect config
        else {
            console.log('Error trying to register commands.');
            return;
        }
    }

    // On startup
    client.once('ready', () => {
        const CLIENT_ID = client.user.id;

        const rest = new REST({
            version: '9',
        }).setToken(process.env.BOT_TOKEN);

        // Registering Commands
        (async () => {
            try {
                // Developement mode
                if (mode === 'DEV') {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, testGuildID), {
                        body: commands,
                    });

                    // Fetch guild and commands
                    let penis = [];
                    let Guilds = client.guilds.cache.map((guild) => guild);
                    Guilds = Guilds.forEach((guild) => {
                        if (guild.id === testGuildID) penis.push(guild);
                    });
                    let all_fetchedCommands = await penis[0].commands.fetch();

                    // Get all the devOnly commands
                    devCommands.forEach((devCommand) => {
                        devCommands.push(
                            all_fetchedCommands.find((command) => command.name === devCommand).id
                        );
                    });

                    // Filter out IDs
                    devCommands = devCommands.filter(function (el) {
                        return el.length && el == +el;
                    });

                    console.log('devCommands:');
                    console.log('ids: ' + devCommands);

                    const permissions = [
                        {
                            id: botOwner,
                            type: 'USER',
                            permission: true,
                        },
                    ];

                    // Assign permissions
                    if (devCommands) {
                        devCommands.forEach(async (devCommand) => {
                            devCommand = await client.guilds.cache
                                .get(testGuildID)
                                ?.commands.fetch(devCommand);
                            await devCommand.permissions.set({ permissions });
                        });
                    }

                    console.log('Sucessfully registered commands locally:');
                    console.log(commandList);
                }

                // Deploy Mode
                else if (mode === 'PROD') {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands,
                    });

                    console.log('Successfully registered commands globally:');
                    console.log(commandList);
                }
                // Incorrect config
                else {
                    console.log('Error trying to register commands.');
                    return;
                }
            } catch (err) {
                if (err) console.log(err);
            }
        })();
    });

    // Executing Commands
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (err) {
                return console.log(err);
            }
        }

        if (interaction.isSelectMenu()) {
            let penisJoe;
            let whichJoe = Math.random() < 0.5;
            if (whichJoe == true) penisJoe = JOE1;
            if (whichJoe == false) penisJoe = JOE2;

            if (interaction.customId === 'commands-menu') {
                if (interaction.values == 'setsteam-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/setsteam`)
                        .setDescription(
                            `You can use this command to save your steamID in the bot's database so it can automatically use it when using commands such as \`/pb\`.`
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed] });
                } else if (interaction.values == 'mode-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/mode`)
                        .setDescription(
                            `You can use this command to save your preferred mode in the bot's database so it can automatically use it when using commands such as \`/pb\`.`
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'invite-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/invite`)
                        .setDescription(`Get a link to invite the bot to your server.`)
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'pb-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/pb`)
                        .setDescription(
                            `Use this command to check your Personal Best on a specified map.\nExample:\n\`\`\`/pb kz_lionharder\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'wr-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/wr`)
                        .setDescription(
                            `Check the current World Record on a specified map for one or multiple modes.\nExample:\n\`\`\`/wr kz_lionharder\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'maptop-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/maptop`)
                        .setDescription(
                            `Check the current Top 10 Leaderboard on a specified map and mode. You can also specify a runtype if you want.\nExample:\n\`\`\`\n/maptop kz_lionharder skz\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'bpb-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/bpb`)
                        .setDescription(
                            `Check your Personal Best on a Bonus Course of a specified Map.\nExample:\n\`\`\`\n/bpb kz_lionharder 1\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'bwr-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/bwr`)
                        .setDescription(
                            `Check the current World Record on a Bonus Course of a specified map.\nExample:\n\`\`\`\n/bwr kz_lionharder 1\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'bmaptop-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/bmaptop`)
                        .setDescription(
                            `Check the current Top 10 Leaderboard on a Bonus Course of a specified Map.\nExample:\n\`\`\`\n/bmaptop kz_lionharder 1\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'recent-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/recent`)
                        .setDescription(
                            `Check your own (or someone else's) latest Personal Best.\nExample:\n\`\`\`\n/recent AlphaKeks\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'top-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/top`)
                        .setDescription(
                            `Check who is currently holding the most World Records in a specified mode (and runtype if you want!).\nExample:\n\`\`\`\n/top kzt tp\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'profile-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/profile`)
                        .setDescription(
                            `Get an overview of a player's stats. You can check their map completion %, overall and avarage points, preferred mode and more.\nExample:\n\`\`\`\n/profile AlphaKeks\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'unfinished-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/unfinished`)
                        .setDescription(
                            `Check which maps you still need to finish in a specified mode.\nExample:\n\`\`\`\n/unfinished skz\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'nocrouch-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/nocrouch`)
                        .setDescription(
                            `Did you forget to crouch at the end of your jump? Don't worry, you can get an approximation of how far the jump would have been if you had crouched at the end of it. You just need to provide the actual distance that you jumped + your max speed. Note that this only works for jumps done on 128 tick servers.\nExample:\n\`\`\`\n/nocrouch 271.6793 368.07\n\`\`\`\nResult: \`283.1815\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'hasfilter-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/hasfilter`)
                        .setDescription(
                            `On some maps you can only submit times in certain modes. Check which modes can actually submit times on a specified map. Also works for bonuses!\nExample:\n\`\`\`\n/hasfilters kz_lionharder\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                } else if (interaction.values == 'map-value') {
                    let embed = new MessageEmbed()
                        .setColor('#7480c2')
                        .setTitle(`/map`)
                        .setDescription(
                            `Get information like tier, mapper, workshopID & more!\nExample:\n\`\`\`\n/map kz_lionharder\n\`\`\``
                        )
                        .setFooter({
                            text: `(͡ ͡° ͜ つ ͡͡°)7 | schnose.eu/church`,
                            iconURL: penisJoe,
                        });
                    return interaction.update({ embeds: [embed], ephemeral: true });
                }
            }
        }
    });
}

module.exports = commandReg;
