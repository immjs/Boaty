const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ['b'],
            group: 'modération',
            memberName: 'ban',
            description: 'Ban l\'utilisateur mentioné',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['BAN_MEMBERS'],
            examples: ['ban @User Il est méchant !'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Qui voulez-vous bannir ?',
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
                .setTitle("Vous ne pouvez pas bannir un modérateur \:'(")
                .setColor("#FF0000")
           return msg.embed(ErrEmbed)
        }
        var banEmbed = new RichEmbed() // Creates the embed that's DM'ed to the user when their warned!
            .setColor("#FF0000")
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setTitle(`Vous avez été banni de ${msg.guild.name}`)
            .addField('Banni par', msg.author.tag)
            .addField('Raison : ', content)
            .setDescription('Ne recommencez plus **jamais !**')
            .setTimestamp();
        var errorEmbed = new RichEmbed()
            .setColor("#FF0000")
            .setTitle(`Vous ne pouvez pas bannir cette personne !`)
            .setTimestamp()

    if(!user.bannable) return msg.embed(errorEmbed)


    user.ban(`Banni par ${msg.author.username} pour la raison ${content}`);
        var SuccessEmbed = new RichEmbed()
        .setColor(0x00AE86)
        .setTitle(`Le BanHammer a bien frappé ${user} !`)
        .setDescription(`Raison : ${content}`)
        .setTimestamp()

        let BanEmbed = new RichEmbed()
        .setTitle("BAN")
        .setColor("#0000000")
        .addField("Modérateur : ", msg.author)
        .addField("Utilisateur banni :", user)
        .addField("Banni dans", msg.channel)
        .addField("Heure :", msg.createdAt)
        .addField("Raison :", content);

        try{
            await user.send(banEmbed)
          }catch(e){
            msg.channel.send(`Cet utilisateur a été banni mais je ne peux pas lui envoyer de mp pour lui expliquer.`)
          }


          let BanEmbedLog = new RichEmbed()
                    .setTitle("BAN")
                    .setColor("#0000000")
                    .addField("Modérateur : ", msg.author)
                    .addField("Utilisateur banni :", user)
                    .addField("Banni dans", msg.channel)
                    .addField("Heure :", msg.createdAt)
                    .addField("Raison :", content);

          channel.send(BanEmbedLog);

    return msg.embed(SuccessEmbed);

    }
};
