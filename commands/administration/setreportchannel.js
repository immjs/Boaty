const { Command, Commando } = require('discord.js-commando');
const { RichEmbed, MessageAttachment } = require('discord.js');




module.exports = class SetCommandChannel extends Command {
    constructor(client) {
        super(client, {
            name: 'reportchannel',
            aliases: ['src', 'reportchan'],
            group: 'administration',
            memberName: 'src',
            description: 'Définisez le channel où les reports seront reçus',
            userPermissions: ['ADMINISTRATOR'],
            examples: ['src #plaintes'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'content',
                    prompt: 'Quelle va être le channel des reports ?',
                    type: 'channel',
                    
                }
            ]
                
            
        });    
    }

    async run(msg, { content }) {
        msg.delete()
        const rawChan = content
        const chanTosrc = rawChan.id;
        msg.guild.settings.set('src', chanTosrc);
            var RichSuccess = new RichEmbed()
            .setTitle(`Channel des reports défini avec succès !`)
            .setColor(0x00AE86)
            .setTimestamp();
        msg.embed(RichSuccess);
        
       
        
    }
};