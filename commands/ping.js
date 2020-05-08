module.exports = {
    name: "ping",
    syntax: "$ping",
    aliases: [],
    fn: (dat, message, client) => message.channel.send("Pong! WS @ " + client.ws.ping + "ms")
}