const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class PurgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            aliases: ['purge', 'cl'],
            group: 'modération',
            memberName: 'clear',
            description: 'Supprimer un nombre de messages précis',
            userPermissions: ['MANAGE_MESSAGES'],
            clientPermissions: ['MANAGE_MESSAGES'],
            examples: ['clear 10'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                key: 'value',
                prompt: 'Combien de message voulez-vous supprimer ?',
                type: 'integer'
                }
                
            ]
        });    
    }

    async run(msg, { value }) {
        let channel = msg.guild.channels.find(c => c.id === msg.guild.settings.get("modlog"));
        if(!channel) return msg.reply("Veuillez setup un channel de log avec la commande bo!modlog !");
        var deleteFailed = new RichEmbed().setTitle("Un erreur est survenu !").setDescription("Il est impossible de supprimer plus de 99 messages d'un coup !").setColor("#FF0000").setTimestamp()
        if(value > 99) return msg.embed(deleteFailed);
        msg.channel.bulkDelete(value + 1).catch(error => console.log(error.stack));
        var deleteSuccess = new RichEmbed()
        .setDescription(`J'ai supprimé ${value} messages pour vous !`)
            .setAuthor(msg.author.username)
            .setColor(0x00AE86)
            .setTimestamp();
        msg.embed(deleteSuccess)
        .then(msg => {
            msg.delete(1000)
          })
          .catch(console.error);


          let PurgeEmbedLog = new RichEmbed()
                .setTitle("CLEAR")
                .setColor("#0000000")
                .addField("Modérateur : ", msg.author)
                .addField("Dans :", msg.channel)
                .addField("Heure :", msg.createdAt)
                .addField("Messages supprimés", value);
          
            
            channel.send(PurgeEmbedLog);
    }
};