const { Command, Commando } = require('discord.js-commando');
const { RichEmbed, MessageAttachment } = require('discord.js');

module.exports = class SetInterChatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'interchat',
            aliases: ['sic'],
            group: 'administration',
            memberName: 'interchar',
            description: 'Définisez si le chat l\'inter-serveur est activé',
            userPermissions: ['ADMINISTRATOR'],
            examples: ['sic true'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'content',
                    prompt: 'Activé = true, désactivé = false',
                    type: 'string',
                    
                }
            ]
                
            
        });    
    }

    async run(msg, { content }) {
        msg.delete()
        var status = ""
       switch (content) {
             case "true": 
                    msg.guild.settings.set('sic', 'true');
                    // Create a new text channel
                    if (!msg.guild.channels.exists('name', 'inter-serveur'))
                    {
                        msg.guild.createChannel('inter-serveur', 'text')
                        .then(console.log)
                        .catch(console.error);
                    }
                    status = "activé"
        break;
            case "false":
                    msg.guild.settings.set('sic', 'true');
                    status = "désactivé"
        break;
             default:
                    return msg.channel.send("**true** = Activé\r**false** : désactivé")
       }
           
            var RichSuccess = new RichEmbed()
            .setTitle(`le Channel inter-serveur est désormais ${status} !`)
            .setColor(0x00AE86)
            .setTimestamp();
        msg.embed(RichSuccess);
        
       
        
    }
};