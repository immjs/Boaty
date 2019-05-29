const sqlite = require('sqlite'); // DB GuildSettings
const sqlite3 = require('sqlite3'); // DB 
const path = require('path');


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
       
    })
   


    try {
        client.login(process.env.DTOKEN); // Token de production
      }
      catch(error) {
        client.login('TOKEN DE TEST'); // Token de test
      }
      
 

