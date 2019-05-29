const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class nickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nickname',
            aliases: ['nick', 'pseudo', 'n'],
            group: 'modération',
            memberName: 'nickname',
            description: 'Change le pseudo de la personne',
            userPermissions: ['CHANGE_NICKNAME'],
            clientPermissions: ['CHANGE_NICKNAME'],
            examples: ['nick @User Jean-Eudes'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Qui voulez-vous renommer ?',
                    type: 'member'
                },
                {
                    key: 'content',
                    prompt: 'Quelle va être son nouveau pseudo ?',
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
        user.setNickname(content
          ).then(() => {
            var successEmbed = new RichEmbed()
                .setDescription(`J'ai renommé cette personne en ${content} !`)
                .setAuthor(msg.author.username)
                .setColor(0x00AE86)
                .setTimestamp();
            msg.embed(successEmbed)

            let NickEmbedLog = new RichEmbed()
                    .setTitle("NICK")
                    .setColor("#0000000")
                    .addField("Modérateur : ", msg.author)
                    .addField("Utilisateur renommé:", user)
                    .addField("Renommage dans", msg.channel)
                    .addField("Heure :", msg.createdAt)
                    .addField("Nouveau pseudo :", content);

              
            
             
              channel.send(NickEmbedLog);
          }).catch(err => {
           
            const ErrEmbed = new RichEmbed()
                .setTitle("**ERREUR**")
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setDescription("Je ne peux pas renommer ce membre \:'(")
                .setColor("#e74c3c")
            msg.embed(ErrEmbed)
            console.error(err);
          });
    }
};
