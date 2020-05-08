module.exports = {
    name: "say",
    syntax: "$say <query:string>",
    aliases: [],
    fn: (args, message, client) => message.channel.send(args.query)
}