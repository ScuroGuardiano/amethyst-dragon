import { config } from 'dotenv';
config();
import { Client, Intents } from 'discord.js';
import banner from './commands/banner';
import Command from './commands/command';
import ping from './commands/ping';

if (!process.env.DISCORD_TOKEN) {
    console.error("YOU MUST SET DISCORD TOKEN ENVIRONMENT VARIABLE");
    process.exit(1);
}

const guildCommands: Command[] = [
    banner,
    ping
];

const DMCommands: Command[] = [
    ping
]

const client = new Client({
    intents: [...Object.values(Intents.FLAGS).filter(flag => ![Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES].includes(flag))],
    partials: ['CHANNEL', 'MESSAGE', 'REACTION']
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.id === client.user.id) {
        return;
    }

    if (message.channel && message.channel.type === "GUILD_TEXT") {
        guildCommands.forEach(command => command.handleMessage(message));
    }

    if (message.channel && message.channel.type === 'DM') {
        DMCommands.forEach(command => command.handleMessage(message));
    }

});

client.login(process.env.DISCORD_TOKEN);
