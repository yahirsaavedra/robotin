const discord = require('discord.js');
const bot = new discord.Client({
    partials: ['MESSAGE','REACTION','USER','GUILD','GUILD_MEMBER'],
	autoReconnect: true
});
var schedule = require('node-schedule');
var tocaSchool = (new Date().getHours() >=6 && new Date().getHours() <=13 && new Date().getDay() >=1 && new Date().getDay() <=5);

bot.on('message', message => {
	/* INICIO AVISAR POR VC CUANDO HAYA TAREAS */
  if (message.channel.id === "758715928061018143" && message.webhookID && message.content.includes("@everyone")) {
    if (message.embeds[0].fields[1].value.startsWith("5B")) {
		if (message.embeds[0].title === "Un nuevo mensaje ha sido publicado") {
			if (tocaSchool) {
				bot.channels.fetch("663617018037272597").then(channel => {
					channel.join().then(connection => {
						connection.play('./not_1.mp3')
					})
				})
			} else {
				bot.channels.fetch("663617018037272597").then(channel => {
					channel.join().then(connection => {
						var dispatcher = connection.play('./not_1.mp3');
						dispatcher.on('finish', () => {
							setTimeout(function(){ channel.leave() }, 1500);
						});
					})
				})
			}
		} else if (message.embeds[0].title.includes("Una nueva actividad ha sido asignada")) {
			if (message.embeds[0].fields[2].value === "Actividad") {
				if (tocaSchool) {
					bot.channels.fetch("663617018037272597").then(channel => {
						channel.join().then(connection => {
							connection.play('./not_2.mp3')
						})
					})
				} else {
					bot.channels.fetch("663617018037272597").then(channel => {
						channel.join().then(connection => {
							var dispatcher = connection.play('./not_2.mp3');
							dispatcher.on('finish', () => {
								setTimeout(function(){ channel.leave() }, 1500);
							});
						})
					})
				}
			} else if (message.embeds[0].fields[2].value === "Examen") {
				if (tocaSchool) {
					bot.channels.fetch("663617018037272597").then(channel => {
						channel.join().then(connection => {
							connection.play('./not_3.mp3')
						})
					})
				} else {
					bot.channels.fetch("663617018037272597").then(channel => {
						channel.join().then(connection => {
							var dispatcher = connection.play('./not_3.mp3');
							dispatcher.on('finish', () => {
								setTimeout(function(){ channel.leave() }, 1500);
							});
						})
					})
				}
			} else if (message.embeds[0].fields[2].value === "Videollamada") {
				if (tocaSchool) {
					bot.channels.fetch("663617018037272597").then(channel => {
						channel.join().then(connection => {
							connection.play('./not_4.mp3')
						})
					})
				} else {
					bot.channels.fetch("663617018037272597").then(channel => {
						channel.join().then(connection => {
							var dispatcher = connection.play('./not_4.mp3');
							dispatcher.on('finish', () => {
								setTimeout(function(){ channel.leave() }, 1500);
							});
						})
					})
				}
			} else {
				return
			}
		} else {
			return
		}
	} else {
		return
	}
  } else {
	return
  }
  /* FIN AVISAR POR VC CUANDO HAYA TAREAS */
});

bot.on('ready', () => {
   console.log('Listo'); 
	if (tocaSchool) {
		console.log('Timbre activado')
		bot.channels.fetch("ID CANAL DE AVISO").then(channel => {
			channel.join().then(connection => {
				schedule.scheduleJob('50 7-13 * * 1-5', function(){
				connection.play('./timbreFinal.mp3')
			})
			schedule.scheduleJob('00 7-14 * * 1-5', function(){
				connection.play('./timbre.mp3')
			})
		})
	})
	} else {
		console.log('No es necesario activar el timbre ahora')
		return
	}
});

bot.login('TOKEN DEL BOT');