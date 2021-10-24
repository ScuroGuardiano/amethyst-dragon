import IConfig, { IBannerAvatar, IBannerConfig, IBannerNickname, IBorder, IText } from "../interfaces/guild-config";
import settings from "../settings";
import fetch from 'node-fetch';
import { loadImage } from "canvas";

// I just realized I could just use JOI after writing all of this shit XD

export default async function verifyConfig(config: IConfig): Promise<string> {
    if (config.banners.length > settings.BANNERS_PER_SERVER) {
        return `ERR: You can have maximum ${settings.BANNERS_PER_SERVER} banners per server.`;
    }

    const errors: string[] = [];

    for (let bannerIdx in config.banners) {
        const err = await verifyBannerConfig(config.banners[bannerIdx]);
        if (err) {
            errors.push(`ERR: banners[${bannerIdx}].${err}`);
        }
    }

    if (errors.length > 0) {
        return errors.join('\n');
    }

    return 'OK';
}

async function verifyBannerConfig(banner: IBannerConfig): Promise<string | null> {
    try {
        const backgroundVerif = await verifyBackground(banner.backgroundUrl);
        if (backgroundVerif) {
            return `backgroundUrl: ${backgroundVerif}`;
        }
    } catch(err) {
        console.error(err);
        return `Some unknown error ocurred while verifying background config. Check is background is reachable and valid`;
    }

    if (banner.avatar) {
        const avatarErr = verifyAvatarConfig(banner.avatar); 
        if (avatarErr) {
            return `avatar.${avatarErr}`;
        }
    }

    if (banner.nickname) {
        const nicknameErr = verifyNicknameConfig(banner.nickname);
        if (nicknameErr) {
            return `nickname.${nicknameErr}`;
        }
    }

    if (banner.texts && banner.texts.length > 0) {
        for (let textIdx in banner.texts) {
            const textVerif = verifyTextConfig(banner.texts[textIdx]);
            if (textVerif) {
                return `text.${textVerif}`;
            }
        }
    }

    if (banner.borders && banner.borders.length > 0) {
        for (let borderIdx in banner.borders) {
            const borderVerif = verifyBorderConfig(banner.borders[borderIdx]);
            if (borderVerif) {
                return `borders[${borderIdx}].${borderVerif}`;
            }
        }
    }

    return null;
}

function verifyAvatarConfig(avatar: IBannerAvatar): string | null {
    if (avatar.width > settings.MAX_AVATAR_WIDTH) {
        return `width: ${avatar.width} is too wide! Max allowed width for avatar is: ${settings.MAX_AVATAR_WIDTH}.`;
    }
    if (avatar.height > settings.MAX_AVATAR_HEIGHT) {
        return `height: ${avatar.height} is too high! Max allowed hight for avatar is: ${settings.MAX_AVATAR_HEIGHT}`;
    }
    if (avatar.borders) {
        for (let borderIdx in avatar.borders) {
            const borderVerif = verifyBorderConfig(avatar.borders[borderIdx]);
            if (borderVerif) {
                return `borders[${borderIdx}].${borderVerif}`;
            }
        }
    }

    return null;
}

function verifyNicknameConfig(nickname: IBannerNickname): string | null {
    return verifyTextConfig({ text: '', ...nickname });
}

function verifyTextConfig(text: IText): string | null {
    if (!settings.COLOR_VALIDATION_REGEX.test(text.color)) {
        return `color: ${text.color} is not a valid color.`;
    }
    if (text.text.length > settings.TEXT_CHARACTERS_LIMIT) {
        return `text: ${text.text} is too long! Max allowed limit is: ${settings.TEXT_CHARACTERS_LIMIT}`;
    }
    if (text.size && text.size > settings.MAX_FONT_SIZE) {
        return `size: Font size ${text.size} is too big. Max allowed is: ${settings.MAX_FONT_SIZE}`;
    }  
    if (text.maxWidth && text.maxWidth > settings.MAX_CAPTION_WIDTH) {
        return `maxWidth: ${text.maxWidth} - szerokość tesktu przekracza wartość maksymalną: ${settings.MAX_CAPTION_WIDTH}`;
    }
    if (text.fontFamily && settings.ALLOWED_FONT_FAMILIES.includes(text.fontFamily)) {
        return `fontFamily: ${text.fontFamily} is not allowed fontFamily. Allowed fontFamilies are ${settings.ALLOWED_FONT_FAMILIES.join(', ')}.`
    }
    if (text.borders) {
        for (let borderIdx in text.borders) {
            const borderVerification = verifyBorderConfig(text.borders[borderIdx]);
            if (borderVerification) {
                return `borders[${borderIdx}].${borderVerification}`;
            }
        }
    }
    
    return null;
}

function verifyBorderConfig(border: IBorder) : string | null {
    if (!settings.COLOR_VALIDATION_REGEX.test(border.color)) {
        return `color: ${border.color} is not a valid color.`
    }
    if (border.width < 0) {
        return `width: ${border.width} is not a valid value, negative value are not allowed`;
    }
    return null;
}

async function verifyBackground(backgroundUrl: string): Promise<string | null> {
    const response = await fetch(backgroundUrl, {
        size: settings.MAX_BACKGROUND_SIZE
    });

    if (response.headers.has('content-length')) {
        if (+response.headers.get('content-length') > settings.MAX_BACKGROUND_SIZE) {
            return `background has size of ${+response.headers.get('content-length')} bytes, that's too much, max allowed is: ${settings.MAX_BACKGROUND_SIZE} bytes.`;
        }
    } else {
        return `background has no specified content-length header. Background URL is sus! I don't want it.`;
    }

    if (response.headers.has('content-type')) {
        if (!settings.ALLOWED_CONTENT_TYPES.includes(response.headers.get('content-type'))) {
            return `background has not allowed type of ${response.headers.get('content-type')}. Allowed content types are ${settings.ALLOWED_CONTENT_TYPES.join(', ')}.`;
        }
    } else {
        return `background has no specified content-type header. Background URL is sus! I don't want it.`;
    }

    // Now fetch this bad bitch but remembering that content-type can lie, I set size limit on request, it will throw if exceeds so we need to try ^^
    try {
        const buff = await response.buffer();
        const image = await loadImage(buff);
        
        if (image.width > settings.MAX_BACKGROUND_WIDTH) {
            return `background is too wide! Max allowed banner background width is: ${settings.MAX_BACKGROUND_WIDTH}px`;
        }
        if (image.height > settings.MAX_BACKGROUND_HEIGHT) {
            return `background is too high! Max allowed banner background height is: ${settings.MAX_BACKGROUND_HEIGHT}px`
        }
    }
    catch(err) {
        if (err.type && err.type == 'max-size') {
            return `background size exceeds maximum of ${settings.MAX_BACKGROUND_SIZE}. AND CONTENT-LENGTH LIED, THE URL IS SUS!`;
        }
        console.log(err);
        return `Uknown error while downloading background. Try again later or check if URL is not sus!`;
    }

    return null;
}
