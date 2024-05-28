const { Client, Activity } = require("discord.js-selfbot-v13");
const { exec } = require("child_process");
const fetch = require("node-fetch");
const fs = require("fs");
const { timeStamp } = require("console");
const client = new Client({
    checkUpdate: false,
});

// load config.json
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
client.config = config;

// bot config
const token = client.config.token;
const prefix = client.config.prefix;
const botIds = [client.config.bleedBotId];
var autoReact = client.config.autoReact;
client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    const date = new Date();
    const time =
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    if (message.author.id == client.config.ownerId) {
        if (autoReact) {
            message.react("☠️");
        }
        if (message.content.startsWith(prefix + "c")) {
            let AmountDeleted = 0;
            const index = parseInt(message.content.split(" ")[1]) || 1;
            console.log(`[${time}] Deleting ${index} messages...`);
            // fetch the last 100 messages from the channel and delete the last index of messages owned by client.config.ownerID
            message.channel.messages.fetch({ limit: 100 }).then((messages) => {
                messages.forEach((msg) => {
                    if (AmountDeleted >= index) return;
                    if (msg.author.id === client.config.ownerId) {
                        AmountDeleted++;
                        msg.delete();
                    }
                });
            });
        } else if (message.content.startsWith(prefix + "ar")) {
            // invert the autoReact variable
            autoReact = !autoReact;
            message.channel.send(
                `AutoReact is now ${autoReact ? "enabled" : "disabled"}`
            );
        }
    }
});

process.on("unhandledRejection", async (err, promise) => {
    console.error(
        `[ANTI-CRASH] Prevented crash, Look below for the error and report it to [Arm#0001](https://github.com/Arm-0001/Arms-selfbot/issues)!`
    );
    console.error(`[ANTI-CRASH] Error: ${err}`);
});

client.login(token);
