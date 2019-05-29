const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class nickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setprefix',
            aliases: ['setprefix', 'sp'],
            group: 'modération',
            memberName: 'setprefix',
            description: 'Ajoute un préfix à l\'utilisateur',
            userPermissions: ['CHANGE_NICKNAME'],
            clientPermissions: ['CHANGE_NICKNAME'],
            examples: ['setprefix @User Admin'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'À qui voulez-vous ajouter un préfix ?',
                    type: 'member'
                },
                {
                    key: 'content',
                    prompt: 'Quelle préfix ?',
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
        var userHasPerm = new RichEmbed()
            .setDescription('ERREUR ! Cette personne a la permission `MANAGE_NICKNAMES`')
            .setAuthor(msg.author.username)
            .setColor("#FF0000")
            .setTimestamp();
        if(user.hasPermission('MANAGE_NICKNAMES')) return msg.embed(userHasPerm);

        user.setNickname(`【${content}】${user.user.username}`, `Préfix ajouté par ${msg.author.username}`);
        var successEmbed = new RichEmbed()
        .setDescription(`J'ai mis le préfix 【${content}】à cette personne !`)
            .setAuthor(msg.author.username)
            .setColor(0x00AE86)
            .setTimestamp();
        msg.embed(successEmbed)

        let PrefixEmbedLog = new RichEmbed()
        .setTitle("PREFIX")
        .setColor("#0000000")
        .addField("Modérateur : ", msg.author)
        .addField("Utilisateur renommé:", user)
        .addField("Renommage dans", msg.channel)
        .addField("Heure :", msg.createdAt)
        .addField("Nouveau préfix :", content);

       
            channel.send(PrefixEmbedLog);
    }
};
