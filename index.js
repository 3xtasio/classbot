const Discord = require ("discord.js");
const client = new Discord.Client ();
const { token, prefix } = require ("./config.json");

// Image
const aideimg = ["https://cdn.pixabay.com/photo/2012/04/23/15/46/question-38629_640.png"];
const questionimg = ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Question_book.svg/252px-Question_book.svg.png"];

const teacherRoleName = "Professeur";
const pupilRoleName = "Eleve";

client.on ("ready", () =>
{
    console.log ("Bot started");
    //client.user.setActivity ("surveiller les élèves...");
});

client.on ("guildCreate", guild =>
{
    console.log ("Bot has joined " + guild.name + "(id: " + guild.id + ")");
});

client.on ("guildDelete", guild =>
{
    console.log ("Bot has left " + guild.name + "(id: " + guild.id + ")");
});

client.on ("message", message =>
{
    // Don't respond if the author is a bot
    if (message.author.bot) { return; }
    // Ignore messages that does not start with the command prefix
    if (message.content.indexOf (prefix) !== 0) { return; }
    // Parse command
    const args = message.content.slice (prefix.length).trim ().split (/ +/g);
    const command = args.shift ().toLowerCase ();

    if (command === "help")
    {
        const embed = new Discord.RichEmbed ()
            .setColor ("#0099ff")
            .setTitle ("ClassBot")
            .setDescription ("Un bot qui aide à gérer les cours sur discord \n\n **Prefix** : c! \n")
            .addField ("• **appel** (ou **ap**)", "*Pour faire l'appel*")
            .addField ("• **--** (ou **-**)", "*---*")
            .setFooter ("by Paul & Stéfan");
        message.channel.send (embed)
    }
    else if (command === "q" || command === "question")
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
        makeCall (message, args);
    }
});

function makeCall (message, args)
{
    if (!message.member.voiceChannel)
    {
        message.channel.send ("Vous devez être dans un salon vocal pour faire l'appel.")
    
        return;
    }

    if (!message.member.roles.find ((role) => role.name === teacherRoleName))
    {
        message.channel.send ("Vous n'êtes pas professeur!");

        return;
    }

    if (args.length == 0)
    {
        message.channel.send ("Veuillez entrer le nom du cours (pour notifier les absents)");

        return;
    }

    let className = args[0];
    let now = new Date ();
    let timeString = now.getHours() + ":" + now.getMinutes () + ":" + now.getSeconds();

    message.channel.send ("Je fais l'appel...");

    let totalPupils = 0;
    let connectedPupils = 0;
    let presentPupils = 0;

    message.guild.members.forEach (member =>
    {
        if (member.roles.find ((role) => role.name === pupilRoleName))
        {
            totalPupils += 1;

            if (member.voiceChannel === message.member.voiceChannel)
            {
                connectedPupils += 1;
                presentPupils += 1;
            }
            else if (member.user.presence.status === "online")
            {
                message.channel.send (member.user.username + " est connecté, mais n'est pas présent dans le salon vocal...")
                member.send ("Absence au cours de " + className + " à " + timeString + ". Vous êtes pourtant connecté...").catch (console.log);
                connectedPupils += 1;
            }
            else
            {
                message.channel.send (member.user.username + " n'est pas connecté...");
                member.send ("Absence au cours de " + className + " de " + timeString).catch (console.log);
            }
        }
    });

    message.channel.send ("Appel terminé. Il y a " + totalPupils + " élèves sur ce serveur, " + connectedPupils + " sont connectés, " + presentPupils + " sont présents.");
    
    if (presentPupils == totalPupils)
    {
        message.channel.send ("Tout le monde est présent!");
    }
    else
    {
        message.channel.send ("J'ai envoyé un message aux absents...");
    }
}

// Log in the client
client.login (token);
