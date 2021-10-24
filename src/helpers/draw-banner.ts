import { Canvas, Image, loadImage, NodeCanvasRenderingContext2D } from "canvas";
import fetch from "node-fetch";
import { IBannerAvatar, IBannerConfig, IBannerNickname, IText } from "../interfaces/guild-config";
import settings from "../settings";

export default async function drawBanner(avatarUrl: string, nickname: string, tag: string, config: IBannerConfig) {
    const background = await getBackground(config.backgroundUrl);

    const canvas = new Canvas(background.width, background.height);
    const ctx = canvas.getContext('2d');
    
    if (config.avatar) {
        drawAvatar(ctx, avatarUrl, config.avatar);
    }
    if (config.nickname) {
        drawNickname(ctx, nickname, tag, config.nickname);
    }
    if (config.texts && config.texts.length > 0) {
        config.texts.forEach(text => {
            drawText(ctx, text);
        });
    }
    if (config.borders && config.borders.length > 0) {
        config.borders.forEach(border => {
            ctx.lineWidth = border.width;
            ctx.strokeStyle = border.color;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        });
    }
}

async function getBackground(backgroundUrl: string): Promise<Image> {
    try {
        const response = await fetch(backgroundUrl, {
            size: settings.MAX_BACKGROUND_SIZE
        });
    
        if (!settings.ALLOWED_CONTENT_TYPES.includes(response.headers.get('content-type'))) {
            throw new Error(`Content type ${response.headers.get('content-type')} is not allowed.`);
        }
    
        const background = await loadImage(await response.buffer());
    
        if (background.width > settings.MAX_BACKGROUND_WIDTH) {
            throw new Error(`Background is too wide! Max allowed banner background width is: ${settings.MAX_BACKGROUND_WIDTH}px`);
        }
        if (background.height > settings.MAX_BACKGROUND_HEIGHT) {
            throw new Error(`background is too high! Max allowed banner background height is: ${settings.MAX_BACKGROUND_HEIGHT}px`);
        }

        return background;
    }
    catch (err) {
        if (err.type && err.type == 'max-size') {
            throw new Error(`background size exceeds maximum of ${settings.MAX_BACKGROUND_SIZE}. AND CONTENT-LENGTH LIED, THE URL IS SUS!`);
        }
        throw new Error(`Uknown error while downloading background. Try again later or check if URL is not sus! Error data: ${JSON.stringify(err, null, 2)}`);
    }
}

async function drawAvatar(ctx: NodeCanvasRenderingContext2D, avatarUrl: string, config: IBannerAvatar) {
    ctx.save();
    const avatar = await loadImage(avatarUrl);
    
    const rounded = config.rounded === undefined ? true : config.rounded;

    if (rounded) {
        const center = {
            x: config.x + config.width / 2,
            y: config.y + config.height / 2
        };

        ctx.beginPath();
        ctx.arc(center.x, center.y, config.width / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
    }

    ctx.drawImage(avatar, config.x, config.y, config.width, config.height);

    if (config.borders && config.borders.length > 0) {
        config.borders.forEach(border => {
            ctx.strokeStyle = border.color;
            ctx.lineWidth = border.width;

            if (!rounded) {
                ctx.strokeRect(config.x, config.y, config.width, config.height);
            } else {
                ctx.stroke();
            }
        });
    }

    ctx.restore();
}

function drawNickname(ctx: NodeCanvasRenderingContext2D, nickname: string, tag: string, config: IBannerNickname) {
    ctx.save();

    if (!tag.startsWith('#')) {
        tag = `#${tag}`;
    }

    let text = nickname;
    if (config.showTag) {
        text += tag;
    }
    
    const [font] = drawText(ctx, { text, ...config });

    if (config.tagColor && config.tagColor !== config.color) {
        // Okey now we have major situation
        // We need to draw tag in different color, how we do that?
        // Well we got font from our drawText function, so we can measure how wide nickname is
        ctx.font = font;
        const width = ctx.measureText(nickname).width;
        // Now we can calculate hopefully accureate offset for tag
        const tagXPosition = config.x + width;
        // And we draw our tag
        drawText(ctx, {
            text: tag,
            x: tagXPosition,
            y: config.y,
            color: config.tagColor,
            size: parseInt(font.split(' ')[0])
        });
    }

    ctx.restore();
}

/**
 * 
 * @param ctx canvas 2D rendering context
 * @param config text config
 * @returns [font_of_rendered_text, hight_of_rendered_text, width_of_rendered_text]
 */
function drawText(ctx: NodeCanvasRenderingContext2D, config: IText): [string, number, number] {
    ctx.save();
    
    const fontFamily = config.fontFamily ?? 'sans-serif'

    let size = 0;

    if (config.size) {
        size = config.size;
    } else {
        const maxWidth = config.maxWidth ?? ctx.canvas.width / 2; // If no width is set I will asume it's 1/2 of banner.
        size = calculateTextFontSize(ctx, config.text, fontFamily, maxWidth, config.maxHeight);
    }

    let text = config.text;
    if (config.maxWidth) {
        text = cutTextToFitMaxWidth(ctx, size, config.text, fontFamily, config.maxWidth);
    }
    ctx.font = `${size}px '${fontFamily}'`;
    ctx.fillStyle = config.color;
    ctx.fillText(text, config.x, config.y);

    if (config.borders && config.borders.length > 0) {
        config.borders.forEach(border => {
            ctx.lineWidth = border.width;
            ctx.strokeStyle = border.color;
            ctx.strokeText(text, config.x, config.y);
        });
    }
    
    const metrics = ctx.measureText(text);
    const font = ctx.font;
    ctx.restore();

    return [font, metrics.width, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent];
}

function cutTextToFitMaxWidth(ctx: NodeCanvasRenderingContext2D, size: number, text: string, fontFamily: string, maxWidth: number): string {
    ctx.font = `${size}px '${fontFamily}'`;
    let metrics = ctx.measureText(text);

    if (metrics.width <= maxWidth) {
        return text;
    }

    let width = metrics.width;

    // I could do something like binary seach-like cutting but whatever, text shouldn't be long so I just do simple while loop cutting text xD
    // If performance will the issue here I will make it in binary search format
    while (width > maxWidth && text.length > 0) {
        text = text.substring(0, text.length - 1);
        width = ctx.measureText(text + '...').width;
    }

    return text;
    // Now someone can give 10k characters and DOS the bot <3
    // TODO: Limit the text characters
}

function calculateTextFontSize(ctx: NodeCanvasRenderingContext2D, text: string, fontFamily: string, maxWidth: number, maxHeight?: number) {
    // Okey I have assumption, that width should be directly linked with font-size
    // So I set whatever font size
    let size = 20;
    ctx.font = `${size}px '${fontFamily}'`;

    // Get width of the text
    let metrics = ctx.measureText(text);

    // Now calculate proportion to the maxWidth
    const proportion = maxWidth / metrics.width;

    // And multiply font size by our proportion multiplier, rounding it down, coz I like nice rounded numbers
    size = Math.floor(size * proportion);

    // The same with height now
    if (maxHeight) {
        ctx.font = `${size}px '${fontFamily}'`;
        metrics = ctx.measureText(text);
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        if (height > maxHeight) {
            const proportion = maxHeight / height;
            size = Math.floor(size * proportion);
        }
    }

    return size;
}

