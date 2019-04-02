const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');
const PREFIX = "!";
var moment = require('moment');

var dispatcher; // Play Sound
var stop; //Stop for time
var stopplay; //Stop for control sound
var heure; //For check time

//Init
stop="0";
stopplay="0";

bot.login(process.env.TOKEN) //TOKEN

//Avoid bot-ception (Bot who respond to a bot)
bot.on("message", async message => {
  if(message.author.bot) return;
})

//Set the game of the bot (I use that for select who he does)
bot.on('ready',() => {
    bot.user.setGame(`être prêt !`)
});

//Set a new "action" to the bot each minute
setInterval(function(){
	moment.locale('fr');
	heure = moment().add(1, 'h').format('LT');
	//Check time : Between 11 PM and 7 AM, he's sleeping
	if (heure === '23:00') {
		stop = "1"; //Lock the function between 11PM and 7AM
		console.log("Le bot s'endort");
		bot.user.setGame(`Dormir`);
		setTimeout(function(){
			console.log("Le bot se réveille !");
			bot.user.setGame(`être prêt !`);
			stop = "0"; //Unlock the function
		},28800000);
	} else {
		if (stop === "0"){
			stop = "1"; //Lock the function until the time of the action
			
			//Randomise a number of milliseconds to make a "action"
			var haz1 = 1800000;
			var haz2 = Math.random();
			var haz3 = haz2 * haz1;
			var haz4 = Math.round(haz3);
			
			//While the number is under 300 seconds, it randomise again
			while (haz4 <= 300000){
				haz1 = 1800000;
				haz2 = Math.random();
				haz3 = haz2 * haz1;
				haz4 = Math.round(haz3);
			}
			
			//Random a number between 0 et 7 to choose a "action"
			var haz5 = 7;
			var haz6 = Math.random();
			var haz7 = haz5 * haz6;
			var haz8 = Math.round(haz7);
			
			//Choose and apply the "action"
			switch (haz8) {
				case 0:
					bot.user.setGame(`faire sa compta`);
					break;
				case 1:
					bot.user.setGame(`programmer en Java`);
					break;
				case 2:
					bot.user.setGame(`s'entraîner au Poker`);
					break;
				case 3:
					bot.user.setGame(`faire des projets`);
					break;
				case 4:
					bot.user.setGame(`devenir professionel`);
					break;
				case 5:
					bot.user.setGame(`lire le Ouest France`);
					break;
				case 6:
					bot.user.setGame(`apprendre en auto-dictacte`);
					break;
				case 7:
					bot.user.setGame(`vous convaincre`);
					break;
				}
			
			console.log("Le bot va faire la fonction " + haz8 + " pendant " + haz4 + " secondes");
			//Async wait for unlock the function
			setTimeout(function(){
				console.log("Le bot change d'action");
				stop = "0";
			},haz4);
		}
	} 
}, 60000);

//Send the list of the commands
bot.on('message', message => {
	//Check if the message send contains !help
    if (message.content === '!help') {
		//Send a Direct Message to the writer of the message
      message.author.createDM().then(channel => {
      channel.send(`
      Commandes pour salons textuels :
      ◘ Bonjour Jacques : Dites bonjour à Jacques, il vous répondra ! (Ex : Bonjour Jacques)
      ◘ !mp : Ouvre une session de Message Privé avec Jacques (Ex : !mp)
	  ◘ !roll [1...9999] : Lance un dé du nombre choisi entre 1 et 9999 (Ex : !roll 100)
	  ◘ :bretagne: : Envoie la carte de la Bretagne
	  ◘ !santiano: Envoie une vidéo de Santiano (Ex : !santiano)
      ◘ !say : Commande pour faire parler Jacques, tapez !helpsay pour savoir comment l'utiliser ! (Ex : !say 424578098617384975 Le plat préféré des bretons est la galette)
      ◘ !helpsay : Obtenir de l'aide pour faire parler Jacques (!helpsay)
	  ◘ !time : Retourne l'heure actuelle

      Ensuite, les commandes pour salons vocals (Il faut d'abord être connecté à un salon vocal pour ça) :
      ◘ !play [lien youtube] = Jacques va jouer votre musique (Ex : !play https://www.youtube.com/watch?v=Ns7fNPiNiNc)
      ◘ !volume [Chiffre] = Contrôle le volume de Jacques, de base réglé sur 30% (Ex : !volume 100)
      ◘ !stop = Arrête Jacques quand il produit de la musique (Ex : !stop)
	  ◘ !wizz = Jacques joue le Wizz de MSN (Ex : !wizz)`);
    })
  }
  });

//Send the message of the author by the bot
bot.on('message', message => {
	//Check if the message starts with !say
    if (message.content.startsWith('!say')) {
    var str = message.content
    var chan = message.content
    bot.channels.get(chan.substring(5,23)).send(str.substring(24));
}
});

//Send a Direct Message to the user
bot.on('message', message => {
	//Check if the message contains !mp
    if (message.content === '!mp') {
		//Send the direct message
      message.author.createDM().then(channel => {
      channel.send(`Bonjour ` + message.author + `, que puis-je pour vous ?`);
    })
  }
  });

//Send a Direct Message to the user with help about !say command
bot.on('message', message => {
	//Check if the message contains !helpsay
    if (message.content === '!helpsay') {
		//Send the direct message
      message.author.createDM().then(channel => {
      channel.send(`
      La commande !say s'utilise de la manière suivante : !say <id du salon> <message>
      Par exemple : !say 424578098617384975 J'aime les pommes de douches
      
      Voici les codes des différents salons :
      ◘ #home : 559341940747927552
      `);
    })
  }
  });

//Reply to the user with a message
bot.on('message', message => {
	//Check if the message contains Bonjour Jacques
    if (message.content === 'Bonjour Jacques') {
    message.channel.sendMessage("Oh, bonjour ! Si vous souhaitez discuter avec mon auteur, vous avez juste à écrire @Nathan QUENOUILLERE ! Facile non ?");
  }
});

//Play the sound on the vocal channel
bot.on('message', message =>{
    if(message.content.startsWith('!play')){
		if (stopplay === "1") {
			message.member.voiceChannel.leave();
		}
		stopplay = "1";
		var str = message.content
		args = str.substring(6)
		if(message.member.voiceChannel) {
			message.member.voiceChannel.join().then(connection =>{
				dispatcher = connection.playStream(ytdl(args));
				console.log('Son en cours' + args);
				dispatcher.setVolume(0.03);
				dispatcher.on('error',e => {
					console.log(e);
				});
				dispatcher.on('end',e => {
					console.log('Fin du son');
					connection.disconnect()
				});
			}).catch(console.log);
		}
		stopplay = "0";
    }
})

//Play the Wizz on the vocal channel
bot.on('message', message =>{
    if(message.content.startsWith('!wizz')){
		if (stopplay === "1") {
			message.member.voiceChannel.leave();
		}
		stopplay = "1";    
		if(message.member.voiceChannel) {
			message.member.voiceChannel.join().then(connection =>{
				dispatcher = connection.playStream(ytdl('https://www.youtube.com/watch?v=o9ouD68X6LU&feature=youtu.be'));
				console.log('Son en cours');
				dispatcher.setVolume(0.03);
				dispatcher.on('error',e => {
					console.log(e);
				});
				dispatcher.on('end',e => {
					console.log('Fin du son');
					connection.disconnect()
				});
			}).catch(console.log);
		}
		stopplay = "0";
    }
})

//The user can choose the volume of the track
bot.on('message', message =>{
    if(message.content.startsWith('!volume')){
        var str2 = message.content
        volumelvl1 = str2.substring(8)
        volumelvl2 = volumelvl1/1000
        dispatcher.setVolume(volumelvl2)
    }
})

//Stop the music
bot.on('message', message =>{
    if(message.content.startsWith('!stop')){
        message.member.voiceChannel.leave();
    }
})

//Send a picture of the Bretagne
bot.on('message', message => {
    if (message.content.includes(':bretagne:')) {
    message.channel.send({files: ["./images/bretagne.jpg"]});
  }
});

//Send a video of the music Santiano
bot.on('message', message =>{
    if(message.content.startsWith('!santiano')){
        message.channel.send({files: ["./videos/Santiano.mp4"]});
    }
})

//Send the time throws message
bot.on('message', message =>{
    if(message.content.startsWith('!time')){
		moment.locale('fr');
		var testheure = moment().add(1, 'h').format('LT');
		message.channel.sendMessage('Il est ' + testheure);
    }
})

//Roll a number between 0 and the choice of the user and send it throws message
bot.on('message', message => {
    if(message.content.startsWith('!roll')){
        var roll1 = message.content
        var roll2 = roll1.substring(6,10)
        var roll3 = Math.random()
        var roll4 = roll3 * roll2
        var roll5 = Math.round(roll4)
    message.channel.sendMessage(`Les dés ont parlés : ça donne `+ roll5);
  }
});
