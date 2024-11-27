const Discord = require('discord.js');
const chokidar = require('chokidar');
const siades = require('./siades.js')
const fs = require('fs');
const watcher = chokidar.watch(['./posts', './tareas'], {
  ignored: /(^|[\/\\])\../,
  persistent: true
});
const webhookClient = new Discord.WebhookClient('758785732335894529', '1iJHq3nO4wEXFQnD3kRkyUt9pZJEPqlezjqsP5D03kzjjUggpyXwb5Po-NV_N4Ew2vlo');
const webhookClient2 = new Discord.WebhookClient('760194717681451014', '2v2RMPpsRh3dmlntQkShvDd2rPDkn70S53LQa5xO5sdF_NxZlB_bFi4vzU4P8_qipcML');

watcher.on('change', (path, stats) => {
  fs.readFile('./' + path, function read(err, data) {
    if (err) {
        throw err;
    }
	var res = JSON.parse(data.toString('utf-8'));
	var trigger = res.update;
    if (trigger === true) {
		console.log('El trigger se ha puesto en acción. Avisando al resto.')
		if (res.error === false && res.evento === 'post') {
			if (res.grupo.startsWith("5B")) {
				webhookClient.send(mencion(res.grupo), {
					username: 'PepsiBot',
					avatarURL: 'https://forest.is-pretty.cool/oJFB9G9.png',
					embeds: [{
						fields: [
							{
								name: "Asignatura",
								value: res.materia,
								inline: true
							},
							{
								name: "Grupo",
								value: res.grupo,
								inline: true
							},
							{
								name: "Autor",
								value: res.posts[0].autor,
								inline: true
							},
							{
								name: "Fecha",
								value: res.posts[0].fecha,
								inline: true
							}
						],
						title: "Un nuevo mensaje ha sido publicado",
						description: res.posts[0].texto,
						author: {
							name: "Notificación de la plataforma SIADES",
							icon_url: "https://forest.is-pretty.cool/oJFB9G9.png"
						},
							color: 16771645
				}]
				});
			} else if (res.grupo.startsWith("5A")) {
				webhookClient2.send(mencion(res.grupo), {
					username: 'PepsiBot',
					avatarURL: 'https://forest.is-pretty.cool/oJFB9G9.png',
					embeds: [{
						fields: [
							{
								name: "Asignatura",
								value: res.materia,
								inline: true
							},
							{
								name: "Grupo",
								value: res.grupo,
								inline: true
							},
							{
								name: "Autor",
								value: res.posts[0].autor,
								inline: true
							},
							{
								name: "Fecha",
								value: res.posts[0].fecha,
								inline: true
							}
						],
						title: "Un nuevo mensaje ha sido publicado",
						description: res.posts[0].texto,
						author: {
							name: "Notificación de la plataforma SIADES",
							icon_url: "https://forest.is-pretty.cool/oJFB9G9.png"
						},
							color: 16771645
				}]
				});
			} else {
				return
			}
		} else if (res.error === false && res.evento === 'tarea') {
			if (res.grupo.startsWith("5B")) {
				webhookClient.send(mencion(res.grupo), {
					username: 'PepsiBot',
					avatarURL: 'https://forest.is-pretty.cool/oJFB9G9.png',
					embeds: [{
						fields: [
							{
								name: "Asignatura",
								value: res.materia,
								inline: true
							},
							{
								name: "Grupo",
								value: res.grupo,
								inline: true
							},
							{
								name: "Tipo de asignación",
								value: tipoStr(res.tareas[0].tipo),
								inline: true
							},
							{
								name: "Fecha y hora de publicación",
								value: (res.tareas[0].fechaPublicacion === '' ? 'Desconocido' : res.tareas[0].fechaPublicacion),
								inline: true
							},
							{
								name: "Fecha límite para entregar",
								value: (res.tareas[0].fechaLimite === '' ? 'El profesor no asignó una fecha límite de entrega, o probablemente la haya escrito en alguna publicación.' : res.tareas[0].fechaLimite),
								inline: true
							},
							{
								name: "Horario de la actividad",
								value: (res.tareas[0].horario === '' ? 'El profesor no asignó algún horario.' : res.tareas[0].horario),
								inline: true
							}
						],
						title: "Una nueva actividad ha sido asignada: \"" + (res.tareas[0].titulo === '' ? 'Desconocido' : res.tareas[0].titulo) + "\"",
						description: (res.tareas[0].descripcion === '' ? 'El profesor no escribió ninguna instrucción para esta actividad, probablemente se relacione con alguna publicación que haya realizado antes.' : res.tareas[0].descripcion),
						url: res.tareas[0].link,
						author: {
							name: "Notificación de la plataforma SIADES",
							icon_url: "https://forest.is-pretty.cool/oJFB9G9.png"
						},
							color: tipoHex(res.tareas[0].tipo)
					}]
				});
			} else if (res.grupo.startsWith("5A")) {
				webhookClient2.send(mencion(res.grupo), {
					username: 'PepsiBot',
					avatarURL: 'https://forest.is-pretty.cool/oJFB9G9.png',
					embeds: [{
						fields: [
							{
								name: "Asignatura",
								value: res.materia,
								inline: true
							},
							{
								name: "Grupo",
								value: res.grupo,
								inline: true
							},
							{
								name: "Tipo de asignación",
								value: tipoStr(res.tareas[0].tipo),
								inline: true
							},
							{
								name: "Fecha y hora de publicación",
								value: (res.tareas[0].fechaPublicacion === '' ? 'Desconocido' : res.tareas[0].fechaPublicacion),
								inline: true
							},
							{
								name: "Fecha límite para entregar",
								value: (res.tareas[0].fechaLimite === '' ? 'El profesor no asignó una fecha límite de entrega, o probablemente la haya escrito en alguna publicación.' : res.tareas[0].fechaLimite),
								inline: true
							},
							{
								name: "Horario de la actividad",
								value: (res.tareas[0].horario === '' ? 'El profesor no asignó algún horario.' : res.tareas[0].horario),
								inline: true
							}
						],
						title: "Una nueva actividad ha sido asignada: \"" + (res.tareas[0].titulo === '' ? 'Desconocido' : res.tareas[0].titulo) + "\"",
						description: (res.tareas[0].descripcion === '' ? 'El profesor no escribió ninguna instrucción para esta actividad, probablemente se relacione con alguna publicación que haya realizado antes.' : res.tareas[0].descripcion),
						url: res.tareas[0].link,
						author: {
							name: "Notificación de la plataforma SIADES",
							icon_url: "https://forest.is-pretty.cool/oJFB9G9.png"
						},
							color: tipoHex(res.tareas[0].tipo)
					}]
				});
			} else {
				return
			}
		} else {
			return
		}
	} else {
		return
	}	
  });
});

function tipoStr(valor) {
	if (valor === "exam") {
		return "Examen"
	} else if (valor === "videocam") {
		return "Videollamada"
	} else if (valor === "assignment") {
		return "Actividad"
	} else {
		return "Otra cosa"
	} 
}

function tipoHex(valor) {
	if (valor === "exam") {
		return 16401990
	} else if (valor === "videocam") {
		return 7207494
	} else if (valor === "assignment") {
		return 3113471
	} else {
		return 15156986
	}
}

function mencion(grupo) {
	if (grupo.startsWith("5A")) {
		return '**PRUEBAS DEL BOT EN PROCESO, ESTA NO ES UNA TAREA REAL**'
		//return '<@531676267557158912>'
	} else {
		return '**PRUEBAS DEL BOT EN PROCESO, ESTA NO ES UNA TAREA REAL**'
		//return '@everyone'
	}
}

watcher.on('error', error => console.log(`Error del escaner: ${error}`))
watcher.on('ready', () => console.log('Escaner de archivos listo'))

console.log("Webhook iniciado")