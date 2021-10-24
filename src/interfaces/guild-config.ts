export interface IBorder {
    color: string;
    width: number;
}

export interface IBannerAvatar {
    x: number;
    y: number;
    width: number;
    height: number;
    rounded?: boolean; // Default true
    borders?: IBorder[]; // Borders, you can specify many with different colors to achieve glow for example.
}

export interface IBaseText {
    fontFamily?: string; // Default: 'sans-serif'
    color: string;
    size?: number; // If not specified size will be calculated based on text length
    maxWidth?: number; // If set and size is set then text will be cut and three dots will be inserted at the end, if size is not set it will be used to calculate font size
    maxHeight?: number; // Only valid if size isn't set, it will be used to calculate font size
    borders?: IBorder[]; // Borders, you can specify many with different colors to achieve glow for example.
    x: number;
    y: number;
}

export interface IBannerNickname extends IBaseText {
    showTag?: boolean; // Default: true
    tagColor?: string; // Default: color
}

export interface IText extends IBaseText {
    text: string;
}

export interface IBannerConfig {
    backgroundUrl: string;
    avatar?: IBannerAvatar;
    nickname?: IBannerNickname;
    texts?: IText[];
    borders?: IBorder[]; // Borders, you can specify many with different colors to achieve glow for example.
}

export default interface IConfig {
    banners: IBannerConfig[];
}
