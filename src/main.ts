import { config } from 'dotenv';
config();
import { Client, Intents, MessageAttachment } from 'discord.js';
import { Canvas, loadImage } from 'canvas';

if (!process.env.DISCORD_TOKEN) {
    console.error("YOU MUST SET DISCORD TOKEN ENVIRONMENT VARIABLE");
    process.exit(1);
}

const client = new Client({ intents: [...Object.values(Intents.FLAGS).filter(flag => ![Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES].includes(flag))] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.id === client.user.id) {
        return;
    }
    console.log("What in the name of...");
    const background = await loadImage('data/x.png');
    const avatar = await loadImage(message.author.avatarURL({ format: 'jpg', size: 4096 }));

    const canvas = new Canvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatarSize = Math.round(canvas.height * 2 / 3);
    const padding = Math.round((canvas.height - avatarSize) / 2);

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        padding + avatarSize / 2,
        padding + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2,
        true
    );

    ctx.closePath();
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.clip();

    ctx.drawImage(
        avatar,
        padding,
        padding,
        avatarSize,
        avatarSize
    );

    ctx.restore();

    ctx.font = "72px sans-serif";
    ctx.fillStyle = '#ffffff';
    ctx.fillText("Siema siema, kurwa witam", padding * 3 + avatarSize, padding * 2);
    ctx.fillText(message.member.nickname, padding * 3 + avatarSize, padding * 2 + 100);

    const attachment = new MessageAttachment(canvas.toBuffer());
    await message.channel.send({
        content: "Here ya go~",
        files: [attachment]
    });
});
client.on('messageDelete', async message => {
    console.log("What in the name of...");
})

client.login(process.env.DISCORD_TOKEN);
