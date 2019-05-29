const { Command, Commando } = require('discord.js-commando');
const { RichEmbed, MessageAttachment } = require('discord.js');




module.exports = class ModLogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'modlog',
            aliases: ['md'],
            group: 'administration',
            memberName: 'modlog',
            description: 'Définisez le channel des modlogs',
            userPermissions: ['ADMINISTRATOR'],
            examples: ['modlog #log'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'content',
                    prompt: 'Quelle va être le channel des modlogs ?',
                    type: 'channel',
                    
                }
            ]
                
            
        });    
    }

    async run(msg, { content }) {
        msg.delete()
        const rawChan = content
        const chanToscc = rawChan.id;
        msg.guild.settings.set('modlog', chanToscc);
            var RichSuccess = new RichEmbed()
            .setTitle(`Channel des modlogs défini avec succès !`)
            .setColor(0x00AE86)
            .setTimestamp();
        msg.embed(RichSuccess);
        
       
        
    }
};