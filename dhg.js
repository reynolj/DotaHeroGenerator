const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require('constants')
const Discord = require('discord.js')
const client = new Discord.Client()
var credentials = require('./credentials')

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

const STR = "STRENGTH";
const AGI = "AGILITY";
const INT = "INTELLIGENCE";

var STR_Array = new Array();
var AGI_Array = new Array();
var INT_Array = new Array();

const attributeColor = new Map([
    [STR, "#ce4419"],
    [AGI, "#3acd43"],
    [INT, "#2bc1d2"]
]);

const attributeImage = new Map([
    [STR, `./assets/attributes/strength.png`],
    [AGI, `./assets/attributes/agility.png`],
    [INT, `./assets/attributes/intelligence.png`]
]);

class Hero{
    constructor(id, heroName, wikiLink, attribute, lore, attackType){
        this.id = id;
        this.heroName = heroName;
        this.wikiLink = wikiLink;
        this.attribute = attribute;
        this.lore = lore;
        this.attackType = attackType;
    }
}

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
            heroList[i].wikiLink,
            heroList[i].attribute,
            heroList[i].lore,
            heroList[i].attackType
        )
        if (heroList[i].attribute == STR)
            STR_Array.push(hero)
        else if (heroList[i].attribute == AGI)
            AGI_Array.push(hero)
        else
            INT_Array.push(hero)

        i++
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
    if (attribute == STR){
        var index = Math.floor(Math.random()*STR_Array.length);
        hero = STR_Array[index];
    }
    else if(attribute == AGI){
        var index = Math.floor(Math.random()*AGI_Array.length);
        hero = AGI_Array[index];
    }
    else if (attribute == INT){
        var index = Math.floor(Math.random()*INT_Array.length);
        hero = INT_Array[index];
    }
    return hero;
}

function randomCommand(arguments, receivedMessage) {
    if(arguments.length == 0) {
        let heroList = [
            randomHero(STR),
            randomHero(AGI),
            randomHero(INT)
        ];
 
        heroList.forEach(hero => {
            console.log(hero.heroName)
        })

        heroList.forEach(hero => {
            const footerImg = new Discord.MessageAttachment(attributeImage.get(hero.attribute), "attribute.png")
            const heroImg = new Discord.MessageAttachment(`./assets/thumbnails/${hero.id}.png`, "hero.png")
            let embedMsg = new Discord.MessageEmbed()
                .setColor(attributeColor.get(hero.attribute))
                .setTitle(hero.heroName)
                .setDescription(hero.lore)
                .setURL(hero.wikiLink)
                .setThumbnail('attachment://hero.png')
                .attachFiles(footerImg)
                .attachFiles(heroImg)
                .setFooter(hero.attackType, 'attachment://attribute.png')
            receivedMessage.channel.send(embedMsg)
        })
    }
    else if (arguments.length == 1){
        attribute = arguments[0].toUpperCase()

        if ([STR, AGI, INT].includes(attribute)){
            var hero = randomHero(attribute)

            // console.log(`${JSON.stringify(hero.heroName)}`)
            const footerImg = new Discord.MessageAttachment(attributeImage.get(hero.attribute), "attribute.png")
            const heroImg = new Discord.MessageAttachment(`./assets/thumbnails/${hero.id}.png`, "hero.png")
            let embedMsg = new Discord.MessageEmbed()
                .setColor(attributeColor.get(hero.attribute))
                .setTitle(hero.heroName)
                .setDescription(hero.lore)
                .setURL(hero.wikiLink)
                .setThumbnail('attachment://hero.png')
                .attachFiles(footerImg)
                .attachFiles(heroImg)
                .setFooter(hero.attackType, 'attachment://attribute.png')
            receivedMessage.channel.send(embedMsg)
        }
        else{
            receivedMessage.channel.send(`${arguments[0]} is not a valid attribute. Valid attributes are ${[STR, AGI, INT]}`)
        }
    } 
    else if (arguments.length == 2){
        attribute1 = arguments[0].toUpperCase()
        attribute2 = arguments[1].toUpperCase()
        if ([STR, AGI, INT].includes(attribute1) && [STR, AGI, INT].includes(attribute2)){
            var hero1 = randomHero(attribute1)
            var hero2 = randomHero(attribute2)

            // console.log(`${JSON.stringify(hero1.heroName)}`)
            // console.log(`${JSON.stringify(hero2.heroName)}`)

            let footerImg = new Discord.MessageAttachment(attributeImage.get(hero1.attribute), "attribute.png")
            let heroImg = new Discord.MessageAttachment(`./assets/thumbnails/${hero1.id}.png`, "hero.png")
            let embedMsg = new Discord.MessageEmbed()
                .setColor(attributeColor.get(hero1.attribute))
                .setTitle(hero1.heroName)
                .setDescription(hero1.lore)
                .setURL(hero1.wikiLink)
                .setThumbnail('attachment://hero.png')
                .attachFiles(footerImg)
                .attachFiles(heroImg)
                .setFooter(hero1.attackType, 'attachment://attribute.png')
            receivedMessage.channel.send(embedMsg)

            footerImg = new Discord.MessageAttachment(attributeImage.get(hero2.attribute), "attribute.png")
            heroImg = new Discord.MessageAttachment(`./assets/thumbnails/${hero2.id}.png`, "hero.png")
            embedMsg = new Discord.MessageEmbed()
                .setColor(attributeColor.get(hero2.attribute))
                .setTitle(hero2.heroName)
                .setDescription(hero2.lore)
                .setURL(hero2.wikiLink)
                .setThumbnail('attachment://hero.png')
                .attachFiles(footerImg)
                .attachFiles(heroImg)
                .setFooter(hero2.attackType, 'attachment://attribute.png')
            receivedMessage.channel.send(embedMsg)
        }
        else{
            var badAttribute;
            if (![STR, AGI, INT].includes(attribute1)){
                badAttribute = arguments[0]
            }
            else{
                badAttribute = arguments[1]
            }
            receivedMessage.channel.send(`${badAttribute} is not a valid attribute. Valid attributes are ${[STR, AGI, INT]}`)
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

// class Str_Hero{
//     constructor(heroName, wikiLink, thumbnail, lore, attackType){
//         this.attribute = STR;
//         this.attributeColor = "#ce4419";
//         this.attributeImage = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/7/7a/Strength_attribute_symbol.png/revision/latest?cb=20180323111829';
//         Hero.call(this, heroName, wikiLink, thumbnail, lore, attackType)
//     }
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


//     download('https://static.wikia.nocookie.net/dota2_gamepedia/images/7/7a/Strength_attribute_symbol.png/revision/latest?cb=20180323111829', `./assets/attributes/strength.png`, function(){
//         console.log(`created`);
//     })
//     download('https://static.wikia.nocookie.net/dota2_gamepedia/images/2/2d/Agility_attribute_symbol.png/revision/latest?cb=20180323111717', `./assets/attributes/agility.png`, function(){
//         console.log(`created`);
//     })
//     download('https://static.wikia.nocookie.net/dota2_gamepedia/images/5/56/Intelligence_attribute_symbol.png/revision/latest?cb=20180323111753', `./assets/attributes/intelligence.png`, function(){
//         console.log(`created`);
//     })
// }