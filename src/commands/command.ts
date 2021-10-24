import { Message } from "discord.js";

export default class Command {
    constructor(public commandName: string, private handler: (message: Message) => any) {}
    
    public handleMessage(message: Message) {
        let command = message.content.split(' ')[0];
        if (command === this.commandName) {
            this.execute(message);
        }
    }

    public execute(message: Message) {
        this.handler(message);
    }
}
