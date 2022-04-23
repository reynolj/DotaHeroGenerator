const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require('constants')
const Discord = require('discord.js')
const client = new Discord.Client()
const credentials = require('./credentials')
const constants = require('./constants')
const { getActualAttribute, STR, AGI, INT } = require('./constants')

// You'll need a credentials file
client.login(credentials.login_hash)

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.user.setActivity("on Node.js", {type: "PLAYING"})

    client.guilds.cache.forEach((guild) => {
        console.log(guild.name)
        guild.channels.cache.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
        })
    })
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }
    //receivedMessage.channel.send("Message received, " + receivedMessage.author.toString() + ": " + receivedMessage.content)
    if (receivedMessage.content.startsWith("!")) {
        //doCommand(receivedMessage)
        processCommand(receivedMessage)
    }
})

class Hero{
    constructor(id, heroName, lore, attribute, attackType, wikiLink, thumbnail, icon, str, agi, int, total, range, ms, bat){
        this.id = id;
        this.heroName = heroName;
        this.lore = lore;
        this.attribute = attribute;
        this.attackType = attackType;
        this.wikiLink = wikiLink;
        this.thumbnail = thumbnail;
        this.icon = icon;
        this.str = str;
        this.agi = agi;
        this.int = int;
        this.total = total;
        this.range = range;
        this.ms = ms;
        this.bat = bat;
    }
}

const attributeColor = new Map([
    [constants.STR, "#ce4419"],
    [constants.AGI, "#3acd43"],
    [constants.INT, "#2bc1d2"]
])

const attributeToImage = new Map([
    [constants.STR, `./assets/attributes/strength.png`],
    [constants.AGI, `./assets/attributes/agility.png`],
    [constants.INT, `./assets/attributes/intelligence.png`]
])

var STR_Array = new Array();
var AGI_Array = new Array();
var INT_Array = new Array();
var All_Heroes = new Array();

const attributeToArray = new Map([
    [constants.STR, STR_Array],
    [constants.AGI, AGI_Array],
    [constants.INT, INT_Array]
])

//Called once on load
const onLoad = (function () { 
    const fs = require('fs')
    const rawdata = fs.readFileSync('heroes.json')
    let heroList = JSON.parse(rawdata)

    let i = 0
    while(i < heroList.length){
        let hero = new Hero(
            heroList[i].id,
            heroList[i].name,
            heroList[i].lore,
            heroList[i].attribute,
            heroList[i].attackType,
            heroList[i].wikiLink,
            heroList[i].thumbnail,
            heroList[i].icon,
            heroList[i].STR_GAIN,
            heroList[i].AGI_GAIN,
            heroList[i].INT_GAIN,
            heroList[i].TOTAL_GAIN,
            heroList[i].RANGE,
            heroList[i].MS,
            heroList[i].BAT
        )
        attributeToArray.get(heroList[i].attribute).push(heroList[i])
        All_Heroes.push(heroList[i])
        i++
    }
    // console.log(`Strength array length: ${STR_Array.length}`)
    // console.log(`Agility array length: ${AGI_Array.length}`)
    // console.log(`Intelligence array length: ${INT_Array.length}`)
})();

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0].toLowerCase()
    let arguments = splitCommand.slice(1)

    switch (primaryCommand){
        case "help":
            helpCommand(arguments, receivedMessage)
            break;
        case "random":
            randomCommand(arguments, receivedMessage)
            break;
        case "hero":
            if (arguments < 1){
                receivedMessage.channel.send("Error. No HeroName after !hero command.")
                return
            }
            toFind = arguments[0];
            result = findHero(toFind);
            if (result){
                sendHeroMessage(result, receivedMessage)
                return
            }
            receivedMessage.channel.send("Could not find hero: " + toFind)
            break;
        default:
            receivedMessage.channel.send("Unknown command. Try !help`")
    }
}

function helpCommand(arguments, receivedMessage) {
    receivedMessage.channel.send("Try !random or !random [Strength, Agility, Intelligence] or !hero HeroName" )
}

function comparableName(name){
    return name.replace(" ", "").toLowerCase();
}

function findHero(toFind){
    return All_Heroes.find(x => comparableName(x.heroName) == comparableName(toFind))
}

function printHero(hero){
    console.log(hero.heroName)
}

function randomHero(attribute){
    let array = attributeToArray.get(attribute)
    let index = Math.floor(Math.random()*array.length);
    return array[index]
}

function sendHeroMessage(hero, receivedMessage){
    //const footerImg = new Discord.MessageAttachment(attributeToImage.get(hero.attribute), "attribute.png")
    const footerImg = new Discord.MessageAttachment(`${hero.icon}`, "icon.png")
    const heroImg = new Discord.MessageAttachment(`${hero.thumbnail}`, "hero.png")
    let embedMsg = new Discord.MessageEmbed()
        .setColor(attributeColor.get(hero.attribute))
        .setTitle(`${hero.heroName}`)
        //.setDescription(hero.lore)
        .setURL(hero.wikiLink)
        .attachFiles(footerImg)
        .attachFiles(heroImg)
        .setThumbnail('attachment://hero.png')
        .setFooter(`Total: ${hero.total}\nType: ${hero.attackType}`, "attachment://icon.png")
        .addFields(
            { name: 'STR', value: hero.str, inline: true },
            { name: 'AGI', value: hero.agi, inline: true },
            { name: 'INT', value: hero.int, inline: true }
        )
        .addFields(
            { name: 'RNG', value: hero.range, inline: true },
            { name: 'BAT', value: hero.bat, inline: true },
            { name: 'MS', value: hero.ms, inline: true },
        )
    receivedMessage.channel.send(embedMsg)
}

function randomCommand(arguments, receivedMessage) {
    switch (arguments.length){
        case 0:
            let randomHeroList = [
                randomHero(constants.STR),
                randomHero(constants.AGI),
                randomHero(constants.INT)
            ];
    
            randomHeroList.forEach(hero => {
                printHero(hero)
                sendHeroMessage(hero, receivedMessage)
            })
            break;
        case 1:
            attribute = arguments[0].toUpperCase()

            if (constants.attributeAliases.includes(attribute)){
                attribute = constants.getActualAttribute(attribute)
                sendHeroMessage(randomHero(attribute), receivedMessage)
            }
            else {
                receivedMessage.channel.send(`${arguments[0]} is not a valid attribute. Valid attributes are ${constants.attributeAliases}`)
            }
            break;
        case 2:
            attribute1 = arguments[0].toUpperCase()
            attribute2 = arguments[1].toUpperCase()
            if (constants.attributeAliases.includes(attribute1) && constants.attributeAliases.includes(attribute2)){
                attribute1 = getActualAttribute(attribute1)
                attribute2 = getActualAttribute(attribute2)
                sendHeroMessage(randomHero(attribute1), receivedMessage)
                sendHeroMessage(randomHero(attribute2), receivedMessage)
            } 
            else {
                receivedMessage.channel.send(`You enterd an invalid attribute. Valid attributes are ${constants.attributeAliases}`)
            }
            break;
        default:
            receivedMessage.channel.send(`Invalid number of arguments. 0, 1, and 2 are the valid number of arguments`)
    }
}

// function doCommand(receivedMessage){
//     let msg = processCommandOther(receivedMessage)

//     receivedMessage.channel.send(msg)
// }

// function processCommandOther(receivedMessage) {
//     let fullCommand = receivedMessage.content.substr(1)
//     let splitCommand = fullCommand.split(" ")
//     let primaryCommand = splitCommand[0].toLowerCase()
//     let arguments = splitCommand.slice(1)

//     switch (primaryCommand){
//         case "help":
//             return getHelpMsg(arguments, receivedMessage)
//         case "random":
//             return getRandomMsg(arguments, receivedMessage)
//         case "hero":
//             if (arguments < 1){
//                 return "Error. No HeroName after !hero command."
//             }
//             toFind = arguments[0];
//             result = findHero(toFind);
//             if (result){
//                 return getHeroMsg(result, receivedMessage)
//             }
//             return "Could not find hero: " + toFind
//         default:
//             return "Unknown command. Try !help`"
//     }
// }

// function getHelpMsg(arguments, receivedMessage) {
//     return "Try !random or !random [Strength, Agility, Intelligence] or !hero HeroName"
// }

// function getHeroMsg(){
//     return ""
// }

// function getRandomMsg(arguments, receivedMessage) {
//     switch (arguments.length){
//         case 0:
//             let randomHeroList = [
//                 randomHero(constants.STR),
//                 randomHero(constants.AGI),
//                 randomHero(constants.INT)
//             ];
    
//             randomHeroList.forEach(hero => {
//                 printHero(hero)
//                 sendHeroMessage(hero, receivedMessage)
//             })
//             break;
//         case 1:
//             attribute = arguments[0].toUpperCase()

//             if (constants.attributeAliases.includes(attribute)){
//                 attribute = constants.getActualAttribute(attribute)
//                 sendHeroMessage(randomHero(attribute), receivedMessage)
//             }
//             else {
//                 receivedMessage.channel.send(`${arguments[0]} is not a valid attribute. Valid attributes are ${constants.attributeAliases}`)
//             }
//             break;
//         case 2:
//             attribute1 = arguments[0].toUpperCase()
//             attribute2 = arguments[1].toUpperCase()
//             if (constants.attributeAliases.includes(attribute1) && constants.attributeAliases.includes(attribute2)){
//                 attribute1 = getActualAttribute(attribute1)
//                 attribute2 = getActualAttribute(attribute2)
//                 sendHeroMessage(randomHero(attribute1), receivedMessage)
//                 sendHeroMessage(randomHero(attribute2), receivedMessage)
//             } 
//             else {
//                 receivedMessage.channel.send(`You enterd an invalid attribute. Valid attributes are ${constants.attributeAliases}`)
//             }
//             break;
//         default:
//             receivedMessage.channel.send(`Invalid number of arguments. 0, 1, and 2 are the valid number of arguments`)
//     }
