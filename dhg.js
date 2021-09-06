const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require('constants')
const Discord = require('discord.js')
const client = new Discord.Client()
const credentials = require('./credentials')
const constants = require('./constants')
const { getActualAttribute } = require('./constants')
const attributeColor = new Map([
    [constants.STR, "#ce4419"],
    [constants.AGI, "#3acd43"],
    [constants.INT, "#2bc1d2"]
])
cosnt = attributeImage = new Map([
    [constants.STR, `./assets/attributes/strength.png`],
    [constants.AGI, `./assets/attributes/agility.png`],
    [constants.INT, `./assets/attributes/intelligence.png`]
])

class Hero{
    constructor(id, heroName, lore, attribute, attackType, wikiLink, thumbnail){
        this.id = id;
        this.heroName = heroName;
        this.lore = lore;
        this.attribute = attribute;
        this.attackType = attackType;
        this.wikiLink = wikiLink;
        this.thumbnail = thumbnail;
    }
}

// You'll need a credentials file
client.login(credentials.login_hash)

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.user.setActivity("on javascript", {type: "PLAYING"})

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
        processCommand(receivedMessage)
    }
})

var STR_Array = new Array();
var AGI_Array = new Array();
var INT_Array = new Array();

onLoad()

function onLoad(){
    const fs = require('fs')
    const rawdata = fs.readFileSync('heroes.json')
    var heroList = JSON.parse(rawdata)

    let i = 0
    while(i < heroList.length){
        var hero = new Hero(
            heroList[i].id,
            heroList[i].name,
            heroList[i].lore,
            heroList[i].attribute,
            heroList[i].attackType,
            heroList[i].wikiLink,
            heroList[i].thumbnail
        )
        if (heroList[i].attribute == constants.STR)
            STR_Array.push(hero)
        else if (heroList[i].attribute == constants.AGI)
            AGI_Array.push(hero)
        else
            INT_Array.push(hero)

        i++
        // console.log(hero)
    }
    // console.log(`Strength array length: ${STR_Array.length}`)
    // console.log(`Agility array length: ${AGI_Array.length}`)
    // console.log(`Intelligence array length: ${INT_Array.length}`)
}

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } 
    else if (primaryCommand == "random") {
        randomCommand(arguments, receivedMessage)
    // } else if (primaryCommand == "download") {
    //     downloadCommand(arguments, receivedMessage)
    } 
    else {
        receivedMessage.channel.send("Unknown command. Try `!help`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    } 
    else {
        receivedMessage.channel.send("It looks like you need help with " + arguments)
    }
}

function randomHero(attribute){
    var hero;
    if (attribute == constants.STR){
        var index = Math.floor(Math.random()*STR_Array.length);
        hero = STR_Array[index];
    }
    else if(attribute == constants.AGI){
        var index = Math.floor(Math.random()*AGI_Array.length);
        hero = AGI_Array[index];
    }
    else if (attribute == constants.INT){
        var index = Math.floor(Math.random()*INT_Array.length);
        hero = INT_Array[index];
    }
    // heroTest(JSON.stringify(hero))
    return hero;
}

function printHero(object){
     console.log(object.heroName)
}

function sendHeroMessage(hero){
    const footerImg = new Discord.MessageAttachment(attributeImage.get(hero.attribute), "attribute.png")
    const heroImg = new Discord.MessageAttachment(`${hero.thumbnail}`, "hero.png")
    let embedMsg = new Discord.MessageEmbed()
        .setColor(attributeColor.get(hero.attribute))
        .setTitle(hero.heroName)
        .setDescription(hero.lore)
        .setURL(hero.wikiLink)
        .attachFiles(footerImg)
        .attachFiles(heroImg)
        .setThumbnail('attachment://hero.png')
        .setFooter(hero.attackType, 'attachment://attribute.png')
    receivedMessage.channel.send(embedMsg)
}

function randomCommand(arguments, receivedMessage) {
    if(arguments.length == 0) {
        let heroList = [
            randomHero(constants.STR),
            randomHero(constants.AGI),
            randomHero(constants.INT)
        ];

        heroList.forEach(hero => {
            printHero(hero)
            sendHeroMessage(hero)
        })
    }
    else if (arguments.length == 1){
        attribute = arguments[0].toUpperCase()

        if (constants.attributeAliases.includes(attribute)){
            attribute = constants.getActualAttribute(attribute)
            var hero = randomHero(attribute)
            sendHeroMessage(hero)
        }
        else{
            receivedMessage.channel.send(`${arguments[0]} is not a valid attribute. Valid attributes are ${constants.attributeAliases}`)
        }
    } 
    else if (arguments.length == 2){
        attribute1 = arguments[0].toUpperCase()
        attribute2 = arguments[1].toUpperCase()
        if (constants.attributeAliases.includes(attribute1) && constants.attributeAliases.includes(attribute2)){
            attribute1 = getActualAttribute(attribute1)
            attribute2 = getActualAttribute(attribute2)
            var hero1 = randomHero(attribute1)
            var hero2 = randomHero(attribute2)
            sendHeroMessage(hero1)
            sendHeroMessage(hero2)
        }
        else{
            var badAttribute;
            if (![constants.STR, constants.AGI, constants.INT].includes(attribute1)){
                badAttribute = arguments[0]
            }
            else{
                badAttribute = arguments[1]
            }
            receivedMessage.channel.send(`${badAttribute} is not a valid attribute. Valid attributes are ${constants.attributeAliases}`)
        }
    } 
    else {
        receivedMessage.channel.send(`Invalid number of arguments. 0, 1, and 2 are the valid number of arguments`)
    }
}

// function replaceName(name){
//     name = String(name).replace("%27","\'")
//     name = name.replaceAll("_", " ")
//     return name;
// }

// function createJSON(arguments, receivedMessage){
//     var heroList = new Array(HeroArray.length)

//     var index = 1;
//     HeroArray.forEach(hero => {
//         heroList[index-1] = {
//             id: index, 
//             name: replaceName(hero.heroName),
//             wikiLink: `https://dota2.fandom.com/wiki/${hero.heroName}`,
//             attribute: hero.attribute,
//             thumbnail: hero.thumbnail
//         }
//         index = index + 1;
//     });

//     console.log(heroList[0])

//     const fs = require('fs')
//     const util = require('util')


//     const writeFile = util.promisify(fs.writeFile)
//     json = JSON.stringify(heroList); 
//     writeFile('heroes.json', json, 'utf-8')
// }



// function downloadCommand(){
//     var fs = require('fs'),
//     request = require('request');

//     var download = function(uri, filename, callback){
//     request.head(uri, function(err, res, body){
//         console.log('content-type:', res.headers['content-type']);
//         console.log('content-length:', res.headers['content-length']);

//         request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//     });
//     };