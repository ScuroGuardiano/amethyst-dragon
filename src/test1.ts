import { IBannerConfig } from "./interfaces/guild-config";

const test1: IBannerConfig = {
    backgroundUrl: 'https://media.discordapp.net/attachments/719650861445546076/901121106033922108/unknown.png',
    avatar: {
        x: 50,
        y: 20,
        width: 300,
        height: 300,
        rounded: true,
        borders: [
            { color: "white", width: 8 }
        ]
    },
    nickname: {
        x: 50,
        y: 440,
        maxWidth: 1400,
        maxHeight: 150,
        color: '#888',
        borders: [
            { color: '#000', width: 2 }
        ],
        showTag: true,
        tagColor: '#888'
    }
}

export default test1;
