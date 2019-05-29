const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            aliases: ['k'],
            group: 'modération',
            memberName: 'kick',
            description: 'Expulser l\'utilisateur mentioné',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            examples: ['kick @User Il est méchant !'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Qui voulez-vous expulser ?',
                    type: 'member'
                },
                {
                    key: 'content',
                    prompt: 'Quelle est la raison ?',
                    type: 'string',
                    validate: text => {
                        if (text.length < 201) return true;
                        return 'Votre message contient plus de 200 caractères !';
                    }
                }
            ]
        });    
    }

    async run(msg, { user, content }) {
        msg.delete()
        let channel = msg.guild.channels.find(c => c.id === msg.guild.settings.get("modlog"));
        if(!channel) return msg.reply("Veuillez setup un channel de log avec la commande bo!modlog !");
        if(user.hasPermissions('MANAGE_MESSAGES'))
        {
            const ErrEmbed = new RichEmbed()
                .setTitle("Vous ne pouvez pas expluser un modérateur \:'(")
                .setColor("#FF0000")
           return msg.embed(ErrEmbed)
        }
        var kickEmbed = new RichEmbed() // Creates the embed that's DM'ed to the user when their warned!
            .setColor("#FF0000")
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setTitle(`Vous avez été expulser de ${msg.guild.name}`)
            .addField('Expulser par', msg.author.tag)
            .addField('Raison : ', content)
            .setDescription('Ne recommencez plus **jamais !**')
            .setTimestamp();
        var errorEmbed = new RichEmbed()
            .setColor("#FF0000")
            .setTitle(`Vous ne pouvez pas expulser cette personne !`)
            .setTimestamp()
    if(!user.kickable) return msg.embed(errorEmbed)
    user.send(kickEmbed).catch(console.error);
    user.kick(`Kick par ${msg.author.username} pour la raison ${content}`);
        var SuccessEmbed = new RichEmbed()
        .setColor(0x00AE86)
        .setTitle(`Le KickHammer a bien frappé ${user.username} !`)
        .setDescription(`Raison : ${content}`)
        .setTimestamp()


        let KickEmbedLog = new RichEmbed()
                .setTitle("KICK")
                .setColor("#0000000")
                .addField("Modérateur : ", msg.author)
                .addField("Utilisateur kické :", user)
                .addField("Kické dans", msg.channel)
                .addField("Heure :", msg.createdAt)
                .addField("Raison :", content);

                try{
                    await user.send(kickEmbed)
                  }catch(e){
                    msg.channel.send(`Cet utilisateur vient d'être kické mais je ne peux pas lui envoyer de mp pour lui expliquer.`)
                  }

                  
                
                  
                  channel.send(muteembed);

    
    
    return msg.embed(SuccessEmbed);
    
    }
};