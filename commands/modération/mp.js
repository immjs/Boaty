const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class PMCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mp',
            aliases: ['pm', "p", "m"],
            group: 'modération',
            memberName: 'mp',
            description: 'Envoyer un message privé à l\'utilisateur que vous mentionnez',
            userPermissions: ['MANAGE_MESSAGES'],
            examples: ['mp @User Hey !'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'À qui voulez-vous envoyer un message privé ?',
                    type: 'user'
                },
                {
                    key: 'content',
                    prompt: 'Que voulez-vous lui dire ?',
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
        
        const SuccessEmbed = new RichEmbed()
            .setAuthor(user.username, user.avatarURL)
            .setTitle('Message envoyé avec succès !')
            .setColor(0x00AE86)

        var mpEmbed = new RichEmbed()
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setTitle(`**Un nouveau message de chez ${msg.guild.name} !**`)
            .setDescription(content)
            .setTimestamp()
            .setColor(0x00AE86)

            let MSGEmbedLog = new RichEmbed()
            .setTitle("MSG")
            .setColor("#0000000")
            .addField("Modérateur : ", msg.author)
            .addField("Destinataire :", user)
            .addField("Envoyé depuis", msg.channel)
            .addField("Heure :", msg.createdAt)
            .addField("Contenu :", content);

            try {
                await user.send(mpEmbed)
              }catch(e){
                  console.log(e.stack)
                return msg.channel.send(`${user} à désactivé ses mp !`)
              }

              msg.embed(SuccessEmbed)
            
              channel.send(MSGEmbedLog);
    }
};