const util = require('util')

module.exports = {
    name: "eval",
    syntax: "$eval <query:string>",
    aliases: [],
    fn: (args, message, client) => {
        try {
            let res = eval(args.query)
            if (typeof res != "string") res = util.inspect(res)
            message.channel.send(res)
        } catch (e) {
            message.channel.send(util.inspect(e))
        }
    }
}