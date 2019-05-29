const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'modération',
            memberName: 'mute',
            description: 'Muter l\'utilisateur mentioné',
            userPermissions: ['MANAGE_MESSAGES'],
            examples: ['mute @User Il est méchant !'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Qui voulez-vous mute ?',
                    type: 'member'
                },
                {
                    key: 'content',
                    prompt: 'Quelle est la raison ?',
                    type: 'string',
                    validate: text => {
                        if (text.length < 201) return true;
                        return 'Votre msg contient plus de 200 caractères !';
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
                .setTitle("Vous ne pouvez pas muter un modérateur \:'(")
                .setColor("#FF0000")
            return msg.embed(ErrEmbed)
        }
        let muterole = msg.guild.roles.find(`name`, "muted");
            //start of create role
            if(!muterole){
                try{
                muterole = await msg.guild.createRole({
                    name: "muted",
                    color: "#000000",
                    permissions:[]
                })
                msg.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                    });
                });
                }catch(e){
                    console.log(e.stack);
                }
            }

                let muteembed = new RichEmbed()
                .setTitle("MUTE")
                .setColor("#0000000")
                .addField("Modérateur : ", msg.author)
                .addField("Utilisateur muté :", user)
                .addField("Muté dans", msg.channel)
                .addField("Heure :", msg.createdAt)
                .addField("Raison :", content);

                let muteSendToUserEmbed = new RichEmbed()
                    .setTitle(`Vous êtes muté sur ${msg.guild} !`)
                    .setDescription(content)
                    .setFooter("Ne recommencez plus jamais !")
                try{
                    await user.send(muteSendToUserEmbed)
                  }catch(e){
                      console.log(e.stack)
                    msg.channel.send(`Cet utilisateur vient d'être muté mais je ne peux pas lui envoyer de mp pour lui expliquer`)
                  }

                  
                
                  
                  channel.send(muteembed);
                
                await(user.addRole(muterole.id));
                
            }
        }
    
                
