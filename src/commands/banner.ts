import { Canvas, loadImage } from "canvas";
import { MessageAttachment } from "discord.js";
import drawBanner from "../helpers/draw-banner";
import test1 from "../test1";
import Command from "./command";

// export default new Command('banner', async message => {
//     const background = await loadImage('data/x.png');
//     const avatar = await loadImage(message.author.avatarURL({ format: 'jpg', size: 4096 }));

//     const canvas = new Canvas(background.width, background.height);
//     const ctx = canvas.getContext('2d');

//     ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
//     const avatarSize = Math.round(canvas.height * 2 / 3);
//     const padding = Math.round((canvas.height - avatarSize) / 2);

//     ctx.save();

//     ctx.beginPath();

//     ctx.arc(
//         padding + avatarSize / 2,
//         padding + avatarSize / 2,
//         avatarSize / 2,
//         0,
//         Math.PI * 2,
//         true
//     );

//     ctx.closePath();
//     ctx.lineWidth = 12;
//     ctx.strokeStyle = "#ffffff";
//     ctx.stroke();
//     ctx.clip();

//     ctx.drawImage(
//         avatar,
//         padding,
//         padding,
//         avatarSize,
//         avatarSize
//     );

//     ctx.restore();

//     ctx.font = "72px sans-serif";
//     ctx.fillStyle = '#ffffff';
//     ctx.fillText("Siema siema, kurwa witam", padding * 3 + avatarSize, padding * 2);
//     ctx.fillText(message.member.nickname, padding * 3 + avatarSize, padding * 2 + 100);

//     const attachment = new MessageAttachment(canvas.toBuffer());
//     await message.channel.send({
//         content: "Here ya go~",
//         files: [attachment]
//     });
// });

export default new Command('banner', async message => {
    const avatarURL = message.author.avatarURL({ format: 'jpg', size: 4096 });
    const nickname = message.member.nickname;
    const tag = message.author.discriminator;

    const banner = await drawBanner(avatarURL, nickname, tag, test1);

    const attachment = new MessageAttachment(banner);
    await message.channel.send({
        content: "Here ya go~",
        files: [attachment]
    });
});
