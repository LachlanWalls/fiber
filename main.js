console.log("\n----- " + config.name.toUpperCase() + " -----\n")

const Discord = require("discord.js")
const config = require("./config.json")
const token = require('./token.json').token
const fs = require('fs')

const arghandler = require('./js/args')

console.log("Starting client...")
const client = new Discord.Client()
client.on("ready", () => {
    client.user.setPresence({ activity: { name: config.activity }, status: 'online' })
    console.log("\n" + config.name + " is live")
})

let commands = []

let onmsg = message => {
    if (message.author.bot) return
    if (message.content.trim() == "<@!691888529684299806>" || message.content.trim() == "<@691888529684299806>") return message.channel.send("Hello! Type '<@!691888529684299806> help' for help!")

    // timer
    let start = process.hrtime()

    let args = message.content.split(" ").splice(1)
    let command = message.content.split(" ").splice(0, 1)[0]

    if (command == "<@!691888529684299806>" || command == "<@691888529684299806>" && args.length == 0) return message.channel.send("Hello! Type '<@!691888529684299806> help' for help!")
    else {
        args = message.content.split(" ").splice(2)
        command = config.prefix + message.content.split(" ").splice(1, 2)[0]
    }

    // if the command exists, run it

    Object.values(commands).forEach(com => {
        let commandname = com.syntax.split(" ")[0].replace("$", config.prefix)
        if (commandname == command || com.aliases.filter(a => a.replace("$", config.prefix) == rcomm).length > 0) {
            let a = arghandler.process(message.channel, args.filter(arg => arg[0] != "-").join(" "), com.syntax.split(" ").splice(1).join(" "))
            if (a) com.fn(a, message, client)
        }
    })

    // process flags
    if (args.indexOf("-a") > -1) message.channel.send("[-a] " + (process.hrtime(start)[1] / 1000000) + "ms")
}

console.log("\nImporting command files from '" + config.commandsdir + "'...")

// iterate through every file in the commands directory
fs.readdir(config.commandsdir, (err, files) => {
    if (err) console.error(err)
    files.forEach((file, i) => {
        console.log("    - " + file)
            // import it
        let f = require(config.commandsdir + file)
            // add it to our commands object
        commands[f.name] = f

        // if it's the last file, start the bot
        if (i == files.length - 1) {
            console.log("\nPreparing...")
            client.on("message", onmsg)
            console.log("Logging in...")
            client.login(token)
        }
    })
})