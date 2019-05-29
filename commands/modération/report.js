const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class ReportCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'report',
            aliases: ['rp'],
            group: 'modération',
            memberName: 'report',
            description: 'Signalez un membre du serveur au staff',
            examples: ['report @User Trop méchant !'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Qui voulez-vous report ?',
                    type: 'user'
                },
                {
                    key: 'content',
                    prompt: 'Pourquoi ?',
                    type: 'string',
                    validate: text => {
                        if (text.length < 201) return true;
                        return 'Votre message contient plus de 200 caractères !';
                    }
                }
            ]
        });    
    }

    run(msg, { content, user }) {
        msg.delete();

        if(user.bot) return msg.reply("Vous ne pouvez pas report un bot !");
        if(user.id === msg.author.id) return msg.reply("Vous ne pouvez pas vous report vous même !")
        const embed = new RichEmbed()
            .setTitle(`Une nouvelle plainte venant de ${msg.guild.name}`)
            .addField(`Plainte envoyé par `, `${msg.author}`)
            .addField(`Accusé : `, user)
            .addField("Raison :", content)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL)
            .setColor(0x00AE86)
            .setTimestamp();
            if(msg.guild.settings.get('src') === null) {
                msg.guild.owner.send(embed).catch(console.error);
            }else{
                try {
                    msg.guild.channels.find('id', msg.guild.settings.get('src')).send(embed)
                  }
                  catch(error) {
                    msg.guild.owner.send(embed).catch(console.error)
                  }
                
               
            }
       
        const successembed = new RichEmbed()
        .setTitle("Votre report à bien été pris en compte")
        .setColor(0x00AE86)
        .setTimestamp()
        return msg.embed(successembed);
        
    }
};
