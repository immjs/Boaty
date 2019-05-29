const sqlite = require('sqlite'); // DB GuildSettings
const sqlite3 = require('sqlite3'); // DB 
const path = require('path');
const fs = require('fs');
const { RichEmbed, MessageAttachment } = require('discord.js');
var logger = require('logger').createLogger('./log/interserver.log'); // logs to a file
var pubLogger = require('logger').createLogger('./log/interpub.log'); // logs to a file


    var blacklist = ""
    var blacklistServer = ""
    var msgColor = ""
    var msgContent = ""
    const talkedRecently = new Set();
    const talkedRecentlyPub = new Set();


// BlacklistUser
fs.readFile("./blacklist.txt", 'utf8', function(err, data) {
  if (err) throw err;
  console.log('BLACKLIST USER: OK');
  console.log(data)
  blacklist = data
});

// BlackListServeur
fs.readFile("./blacklistServer.txt", 'utf8', function(err, data) {
    if (err) throw err;
    console.log('BLACKLIST SERVER: OK');
    console.log(data)
    blacklistServer = data
  });

const { CommandoClient, SQLiteProvider } = require('discord.js-commando');

// Utiliser pour les users settings
let db = new sqlite3.Database('userdata.sqlite3', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the user database.');
  });

const client = new CommandoClient({
    commandPrefix: 'bo!',
    owner: '383916189736370177',
    disableEveryone: true,
    unknownCommandResponse: false
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['fun', 'Commandes fun'],
		['modération', 'Commandes de modérations'],
        ['administration', 'Commandes d\'administrateur'],
        ['devonly', 'Commandes de dev']

    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        help: true
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
        console.log(`\nLogged as ${client.user.tag} (${client.user.id}) on ${client.guilds.size} server(s) \n`);
        client.user.setActivity(`s'amuser avec vous sur ${client.guilds.size} serveurs`);
    });



// A utiliser QUE pour les settings de serveur
sqlite.open(path.join(__dirname, "settings.sqlite3")).then((db) => {
        client.setProvider(new SQLiteProvider(db));
    });

//joined a server
client.on("guildCreate", guild => {
    console.log("Joined a new guild : " + guild.name);
    client.user.setActivity(`s'amuser avec vous sur ${client.guilds.size} serveurs`); // Update the status
        var BoatyJoinEmbed = new RichEmbed()
            .setTitle("Merci d'avoir choisi Boaty !")
            .setDescription(`Grâce à vous, Boaty est désormais sur ${client.guilds.size} serveurs !\rFaites bo!help pour avoir la liste des commandes disponible`)
            .addField("Serveur support :", "https://discord.gg/AzNVf9U")
            .setColor("#00FF00")
            .setTimestamp()
        guild.owner.send(BoatyJoinEmbed);
})

//removed from a server
client.on("guildDelete", guild => {
    console.log("Left a guild : " + guild.name);
    client.user.setActivity(`s'amuser avec vous sur ${client.guilds.size} serveurs`); // Update the status
})
    
    client.on('message', async message => {
        //Inter serveur
            if(message.author.bot) return;
           
        if(message.guild.settings.get('sic') === "true") {
            if (message.channel.name === "inter-serveur") {   
                    message.delete()
                    if (talkedRecently.has(message.author.id)) {
                        const TalkEmbed = new RichEmbed()
                            .setTitle("OOF ! Vous allez trop vite !")
                            .setDescription("Veuillez attendre 1.5 seconde avant de reposter un autre message")
                            logger.warn(`SPAM`, `${message.author.username}/${message.author.id}`, `SERVER : ${message.guild.name}/${message.guild.id}`, `CONTENT : ${message.content}`);
                            
                       return message.author.send(TalkEmbed);
                    }
                
                // Adds the user to the set so that they can't talk for 2.5 seconds
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after 2.5 seconds
                    talkedRecently.delete(message.author.id);
                }, 1500);
                    if (blacklist.indexOf(message.author.id) > -1) {
                        const blacklistEmbed = new RichEmbed()
                            .setTitle("Erreur")
                            .setDescription("Vous êtes **banni** de l'inter-chat\rSi vous voulez obtenir un déban, merci d'envoyer un mp à `@Pody#4886`")
                            .setColor("#e74c3c")
                            .setTimestamp()
                            .setThumbnail("https://cdn.discordapp.com/attachments/557278178134065154/571012078505033759/274c.png")
                        logger.warn("USER BANNED", `${message.author.username}/${message.author.id}`, `SERVER : ${message.guild.name}/${message.guild.id}`,`CONTENT : ${message.content}`)
                    message.author.send(blacklistEmbed)
                        return;
                    }
                    if (blacklistServer.indexOf(message.guild.id) > -1) {
                        const blacklistServEmbed = new RichEmbed()
                            .setTitle("Erreur")
                            .setDescription("Le serveur auquel vous avez tenté d'envoyer un message est **banni** de l'inter-chat\rSi vous voulez obtenir un déban, merci d'envoyer un mp à `@Pody#4886`")
                            .setColor("#e74c3c")
                            .setTimestamp()
                            .setThumbnail("https://cdn.discordapp.com/attachments/557278178134065154/571012078505033759/274c.png")
                            logger.warn("GUILD BANNED", `${message.author.username}/${message.author.id}`,`SERVER : ${message.guild.name}/${message.guild.id}`, `CONTENT : ${message.content}`)

                message.author.send(blacklistServEmbed)
                        return;
                    }
                    if(message.author.id === "383916189736370177") {
                        msgColor = "#9b59b6"
                        msgContent = `**${message.content}**`
                    }else {
                        msgColor = "#3498db"
                        msgContent = message.content
                    }

                    if(message.content.includes("http://") || message.content.includes("https://") || message.content.includes("www.")) {
                        if(message.author.id !== "383916189736370177") {
                            const LinkEmbed = new RichEmbed()
                            .setTitle("Erreur")
                            .setDescription("Vous ne pouvez pas envoyer de liens dans l'inter-serveur")
                            .setColor("#e74c3c")
                            .setTimestamp()
                            .setThumbnail("https://cdn.discordapp.com/attachments/557278178134065154/571012078505033759/274c.png")
                            logger.warn("LINK", `${message.author.username}/${message.author.id}`, `SERVER : ${message.guild.name}/${message.guild.id}`, `CONTENT : ${message.content}`)
                        message.author.send(LinkEmbed)
                        return;

                        }
                
                    }
                
                    const msgEmbed = new RichEmbed()
                        .setAuthor(`${message.author.username}/${message.author.id}`, message.author.avatarURL)
                        .addField("Message :", msgContent)
                        .setFooter(`de ${message.guild.name}/${message.guild.id}`, message.guild.iconURL)
                        .setColor(msgColor)
                        .setTimestamp()
                        logger.info("MESSAGE", `${message.author.username}/${message.author.id}`,`SERVER : ${message.guild.name}/${message.guild.id}`, `CONTENT : ${message.content}`)

                    client.channels.findAll('name', "inter-serveur").map(channel => channel.send(msgEmbed))
                    }
                }

                // InterPub
                if(message.guild.settings.get('interpub') === "true") {
                    if (message.channel.name === "inter-pub") {   
                            message.delete()
                            if (talkedRecentlyPub.has(message.author.id)) {
                                const TalkEmbed = new RichEmbed()
                                    .setTitle("STOP ! Vous ne pouvez plus poster de pub !")
                                    .setDescription("Veuillez attendre 4h avant de reposter une autre pub")
                                    .addField("Votre pub :", `${message.content}`)
                                    .setColor("#e74c3c")

                                    pubLogger.warn(`TIME`, `${message.author.username}/${message.author.id}`, `SERVER : ${message.guild.name}/${message.guild.id}`, `CONTENT : ${message.content}`);

                               return message.author.send(TalkEmbed);
                            }
                        
                        // Adds the user to the set so that they can't talk for 2.5 seconds
                        talkedRecentlyPub.add(message.author.id);
                        setTimeout(() => {
                            // Removes the user from the set after 2.5 seconds
                            talkedRecentlyPub.delete(message.author.id);
                        }, 14400000);
                            if (blacklist.indexOf(message.author.id) > -1) {
                                const blacklistEmbed = new RichEmbed()
                                    .setTitle("Erreur")
                                    .setDescription("Vous êtes **banni** de l'inter-pub\rSi vous voulez obtenir un déban, merci d'envoyer un mp à `@Pody#4886`")
                                    .setColor("#e74c3c")
                                    .setTimestamp()
                                    .setThumbnail("https://cdn.discordapp.com/attachments/557278178134065154/571012078505033759/274c.png")
                                    pubLogger.warn("USER BANNED", `${message.author.username}/${message.author.id}`, `SERVER : ${message.guild.name}/${message.guild.id}`,`CONTENT : ${message.content}`)
                            message.author.send(blacklistEmbed)
                                return;
                            }
                            if (blacklistServer.indexOf(message.guild.id) > -1) {
                                const blacklistServEmbed = new RichEmbed()
                                    .setTitle("Erreur")
                                    .setDescription("Le serveur auquel vous avez tenté d'envoyer un message est **banni** de l'inter-pub\rSi vous voulez obtenir un déban, merci d'envoyer un mp à `@Pody#4886`")
                                    .setColor("#e74c3c")
                                    .setTimestamp()
                                    .setThumbnail("https://cdn.discordapp.com/attachments/557278178134065154/571012078505033759/274c.png")
                                    pubLogger.warn("GUILD BANNED", `${message.author.username}/${message.author.id}`,`SERVER : ${message.guild.name}/${message.guild.id}`, `CONTENT : ${message.content}`)
        
                        message.author.send(blacklistServEmbed)
                                return;
                            }
                            if(message.author.id === "383916189736370177") {
                                msgColor = "#9b59b6"
                                msgContent = `${message.content}`
                            }else {
                                msgColor = "#3498db"
                                msgContent = message.content
                            }
                        
                            const msgEmbed = new RichEmbed()
                                .setAuthor(`${message.author.username}/${message.author.id}`, message.author.avatarURL)
                                .addField("Message :", msgContent)
                                .setFooter(`de ${message.guild.name}/${message.guild.id}`, message.guild.iconURL)
                                .setColor(msgColor)
                                pubLogger.info("MESSAGE", `${message.author.username}/${message.author.id}`,`SERVER : ${message.guild.name}/${message.guild.id}`, `CONTENT : ${message.content}`)
        
                            client.channels.findAll('name', "inter-pub").map(channel => channel.send(msgEmbed))
                            }
                        }
    })
   


    try {
        client.login(process.env.DTOKEN); // Token de production
      }
      catch(error) {
        client.login('TOKEN DE TEST'); // Token de test
      }
      
 

