import Command from "./command";

export default new Command('ping', message => {
    message.channel.send("Pong!");
});
