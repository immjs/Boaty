const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: ['w'],
            group: 'modération',
            memberName: 'w',
            description: 'Avertir l\'utilisateur mentioné',
            userPermissions: ['MANAGE_MESSAGES'],
            examples: ['warn @User Il est méchant !'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Qui voulez-vous avertire ?',
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

    run(msg, { user, content }) {
        msg.delete()
        let channel = msg.guild.channels.find(c => c.id === msg.guild.settings.get("modlog"));
            if(!channel) return msg.reply("Veuillez setup un channel de log avec la commande bo!modlog !");
        if(user.hasPermissions('MANAGE_MESSAGES'))
        {
            const ErrEmbed = new RichEmbed()
                .setTitle("Vous ne pouvez pas warn un modérateur \:'(")
                .setColor("#FF0000")
           return msg.embed(ErrEmbed)
        }
        var warningEmbed = new RichEmbed() // Creates the embed that's DM'ed to the user when their warned!
        .setColor("#FF0000")
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setTitle(`Vous avez reçu un avertissement sur ${msg.guild.name}`)
        .addField('Avertis par', msg.author.tag)
        .addField('Raison : ', content)
        .setDescription('Ne recommencez plus **jamais !**')
        .setTimestamp();
    user.send(warningEmbed).catch(console.error);
        var SuccessEmbed = new RichEmbed()
        .setColor(0x00AE86)
        .setTitle("Avertissement envoyé avec succès !")
        .setDescription(`Le WarnHammer a bien frappé ${user} !`)
        .setTimestamp()

     msg.embed(SuccessEmbed);

     let WarnEmbedLog = new RichEmbed()
        .setTitle("WARN")
        .setColor("#0000000")
        .addField("Modérateur : ", msg.author)
        .addField("Utilisateur warn:", user)
        .addField("Warn dans", msg.channel)
        .addField("Heure :", msg.createdAt)
        .addField("Raison :", content);

        
            channel.send(WarnEmbedLog);
    }
};
