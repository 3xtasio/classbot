const Discord = require ('discord.js');
const client = new Discord.Client ();
const { token, prefix } = require ('./config.json');

// Image
const aideimg = ['https://cdn.pixabay.com/photo/2012/04/23/15/46/question-38629_640.png'];
const questionimg = ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Question_book.svg/252px-Question_book.svg.png'];

client.once ("ready", () =>
{
    console.log ("ClassBot - En ligne");
});

client.on ("message", message =>
{
    if (!message.content.startsWith (prefix) || message.author.bot) { return; }

    const args = message.content.slice (prefix.length).split (/ +/);
    const command = args.shift ().toLowerCase ();

    if (command === "help")
    {
        const embed = new Discord.RichEmbed()
        .setColor ("#0099ff")
        .setTitle ("ClassBot")
        .setDescription ("Un bot qui aide à gérer les cours sur discord \n\n **Prefix** : c! \n")
        .addField ("• **appel** (ou **ap**)", "*Pour faire l'appel*")
        .addField ("• **--** (ou **-**)", "*---*")
        .setFooter ("by Extasio");
        message.channel.send (embed)
    }
    else if (command === 'q' || command ==='question' )
    {
        message.delete ();
        var question = new Discord.RichEmbed ()
        .setAuthor (`${message.author.username}`)
        .setColor ("#000000")
        .setThumbnail (`${questionimg}`)
        .setDescription ("**Avez-vous des questions?**")
        .setFooter (`Par ${message.author.username}`);
        message.channel.send (question);
    }
    else if (command === "aide" || command === "a")
    {
        message.delete ();
        var question = new Discord.RichEmbed ()
        .setAuthor (`${message.author.username}`)
        .setColor ("#00CCFF")
        .setThumbnail (`${aideimg}`)
        .setDescription ("J'ai besoin d'aide !")
        .setFooter (`Par ${message.author.username}`);
        message.channel.send (question);
    }
    else if (command === "appel" || command === "ap")
    {
        var n = 0;
        message.channel.send ("**Appel en cours** - *Veuillez patienter..*").then (message =>
        {
            message.edit ("▓▓░░░░░░░░░░░░░░░░░░░░░░ 10%");
            message.edit ("▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░ 40%");
            message.edit ("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░ 90%");
            message.edit ("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░ 97%");
            message.edit ("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%");

            message.delete ();

            message.channel.send ("**Les élèves absent sont :**");
            message.guild.members.forEach ((member) =>
            {
                if( (member.roles.has ("691699261544464556") || member.roles.has ("688051390081138765")) && !member.voiceChannel)
                {
                    if(member.roles.has ("691699261032628284")||member.roles.has ("688051354635206676"))
                    {
                    }
                    else
                    {
                        n = n+1;
                        let absent = member.id;
                        message.channel.send (`<@${absent}>`);
                    }
                }
            });

            message.channel.send ("**Il y a **" + n + "** élèves absents **");
            message.channel.send ("*Appel terminé !*");
        });
    }
});

// Log in the client
client.login (token)
