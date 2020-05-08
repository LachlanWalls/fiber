const Discord = require("discord.js")

let t = {
    // syntax !test <pie:string> <test:int> [wat:boolean:test]

    // --- process ---
    // process args
    process: (c, args, syntax) => {
        let parsed = t.parsestringargs(args)

        let mapped = t.mapargs(parsed, syntax)
        if (mapped.res == "missing-args") {
            let embed = new Discord.MessageEmbed()
                .setColor("C90147")
                .addField("Missing arguments", "Required argument(s) `" + mapped.val.join("`, `") + "`.")
            c.send(embed)
            return null
        } else if (mapped.res == "missing-args") {
            let embed = new Discord.MessageEmbed()
                .setColor("C90147")
                .addField("Extra arguments", "Unknown argument(s) `" + mapped.val.join("`, `") + "`.")
            c.send(embed)
            return null
        }

        let checked = t.checkargs(mapped.val, syntax)
        if (checked.res == "bad-format") {
            let embed = new Discord.MessageEmbed()
                .setColor("C90147")
                .addField("Bad argument format", "Argument `" + val[0] + "` could not be converted to type `" + val[1] + "`.")
            c.send(embed)
            return null
        }

        return checked.val
    },

    // --- mapargs ---
    // maps an array of args to an object based on the syntax
    mapargs: (args, syntax) => {

        if (args.length == 0 && syntax == "") return { "res": "success", "val": {} }

        // split the syntax into arguments
        let syntaxargs = syntax.split(" ")

        // get the minimum number of required arguments and maximum number of possible arguments
        let minargs = syntaxargs.filter(arg => arg[0] == "<").length
        let maxargs = syntaxargs.length

        // if we have less args than required, return the missing arg names, if we have more args than required, return the extra args
        if (args.length < minargs || (args.length == 1 && args[0] == "")) return { "res": "missing-args", "val": syntaxargs.splice((args.length == 1 && args[0] == "") ? 0 : args.length).filter(arg => arg[0] == "<") }
        if (args.length > maxargs) return { "res": "extra-args", "val": args.splice(maxargs) }

        let map = {}

        // actually map the args into an object where the keys are the argument names
        args.forEach((arg, i) => map[syntaxargs[i].replace("<", "").replace("[", "").split(":")[0]] = arg)

        return { "res": "success", "val": map }

    },

    // --- checkargs ---
    // attempt to convert all args to the correct data format
    checkargs: (args, syntax) => {

        if (args == {} && syntax == "") return { "res": "success", "val": {} }

        // split the syntax into arguments
        let syntaxargs = syntax.split(" ")

        // we'll form a new args object
        let newargs = {}

        // iterate through the syntax arguments
        for (var i = 0; i < syntaxargs.length; i++) {

            // split the argument into components
            let synarg = syntaxargs[i].replace("<", "").replace(">", "").replace("[", "").replace("]", "").split(":")

            // check if that arg was provided by the user, otherwise return the default value (if provided, otherwise '')
            if (args[synarg[0]]) {

                // get the information from the syntax
                let argname = synarg[0]
                let arg = args[argname]
                let spec = synarg[1].split("%")[0]

                // if it's a string, make sure it's a string
                if (spec == "string") newargs[synarg[0]] = String(arg)

                // if it needs to be an int, and can be converted to an int, convert and add it, otherwise return an error
                else if (spec == "int" && !isNaN(parseInt(arg))) newargs[synarg[0]] = parseInt(arg)
                else if (spec == "int") return { "res": "bad-format", "val": [arg, "int"] }

                // if it needs to be a float, and can be converted to a float, convert and add it, otherwise return an error
                else if (spec == "float" && !isNaN(parseFloat(arg))) newargs[synarg[0]] = parseFloat(arg)
                else if (spec == "float") return { "res": "bad-format", "val": [arg, "float"] }

                // if it needs to be a bool, and if it is true or false (with some flexibility) add the bool, otherwise return an error
                else if (spec == "bool" && arg.toLowerCase() == 'true') newargs[synarg[0]] = true
                else if (spec == "bool" && arg.toLowerCase() == 'false') newargs[synarg[0]] = false
                else if (spec == "bool") return { "res": "bad-format", "val": [arg, "bool"] }

            } else newargs[synarg[0]] = synarg[2] || ""
        }

        return { "res": "success", "val": newargs }

    },

    // --- parsestringargs ---
    // converts something like 'arg1 "arg2 multiple words"' -> ["arg1", "arg2 multiple words"]
    parsestringargs: args => {

        if (args == '') return []

        // keep track of our new args array
        let nargs = ['']

        // keep track of whether or not we're in a pair of quotes, and what type of quote it is
        let sub = ''

        // iterate through the characters
        let strargs = args.split("")
        strargs.forEach(char => {

            // if it's a quote, toggle the quote variable thing
            if ((char == '"' && sub == '"') || (char == "'" && sub == "'")) sub = ''
            else if ((char == '"' || char == "'") && sub == '') sub = char

            // if there's a space and we're not in quotes move on to the next arg
            else if (char == ' ' && sub == '') nargs.push('')

            // otherwise, add the character to the current arg
            else nargs[nargs.length - 1] += char

        })

        return nargs

    }

}

module.exports = t