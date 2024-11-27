const phantom = require('phantom');
const fs = require('fs');
const cookie = require('./config.json')

async function tareasMateria(materia) {
  const instance = await phantom.create();
  const page = await instance.createPage();
  const page2 = await instance.createPage();
  
  page.addCookie({
	name: 'XSRF-TOKEN',
	value: cookie.xsrf,
	domain: 'baja.siades.mx'
  });
  page.addCookie({
	name: 'laravel_session',
	value: cookie.laravel,
	domain: 'baja.siades.mx'
  });
  const status = await page.open('https://baja.siades.mx/setteachersubject/' + materia.toString());
  const content = await page.property('content');
  await page.close();
  
  const status2 = await page2.open('https://baja.siades.mx/exam');
  const content2 = await page2.property('content');
  
    page2.evaluate(function () {
	try {
		if (!String.prototype.endsWith) {
		Object.defineProperty(String.prototype, 'endsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || this.length;
            position = position - searchString.length;
            var lastIndex = this.lastIndexOf(searchString);
            return lastIndex !== -1 && lastIndex === position;
        }
		});
		}
		var tareasTemp = []
		if (document.getElementsByClassName("collapsible-header valign-wrapper ")[0]) {
			for (var i = 0, len = document.getElementsByClassName("collapsible-header valign-wrapper ").length; i < len; i++) {
				tareasTemp.push({tipo: (document.getElementsByClassName("waves-effect waves-light btn white blue-text border-round")[i].innerText === "Ver examen" ? "exam" : document.getElementsByClassName("collapsible-header valign-wrapper ")[i].innerText.split("\n")[0]), titulo: document.getElementsByClassName("collapsible-header valign-wrapper ")[i].innerText.split("\n")[1], fechaPublicacion: document.getElementsByClassName("ultra-small mb-2")[i].innerText.replace(/(\r\n|\n|\r)/gm," ").replace(/^\s+/g, '').replace("Publicado el ", "").replace(/(^\s+|\s+$)/g, ''), fechaLimite: document.getElementsByClassName("collapsible-header valign-wrapper ")[i].innerText.split("\n")[2].replace("Fecha de inicio: ", "").replace("Fecha de inicio:", "").replace("Fecha de entrega: ", "").replace("Fecha de entrega:", "").replace("Fecha de la clase: ", "").replace("Fecha de la clase:", ""), horario: document.getElementsByClassName("collapsible-header valign-wrapper ")[i].innerText.split("\n")[3].replace("Horario: ", "").replace("Horario:", ""), descripcion: (document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').substring(20, document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').length).split("\n").slice(1, document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').substring(20, document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').length).split("\n").length).join("\n").endsWith("Evaluadas") === false ? document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').substring(20, document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').length).split("\n").slice(1, document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').substring(20, document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').length).split("\n").length).join("\n") : document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').substring(20, document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').length).split("\n").slice(1, document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').substring(20, document.getElementsByClassName("row mb-2")[i].innerText.replace(/^\s+/g, '').replace("Publicado el ", "").replace(/^\s+|\s+$/g, '').replace(/^\t+/gm, '').replace(/^\n+/gm, '').replace('  ', ' ').length).split("\n").length - 6).join("\n")), link: document.getElementsByClassName("waves-effect waves-light btn white blue-text border-round")[i].href})
			}
		}
		return {evento: 'tarea', update: false, error: false, materia: document.getElementsByClassName("blue-text truncate")[0].innerHTML.replace("&nbsp;", ""), grupo: document.getElementsByClassName("blue-text truncate")[1].innerHTML.replace(/\s+/, "").split("/")[0].replace("TMTTM", "-TMT (MAT)"), tareas: tareasTemp}
	  } catch (e) {
		return {error: true, update: false}
	  }
    }).then(val => {
		fs.readFile('./tareas/' + materia.toString() + '.json', function read(err, data) {
			try {
				if (JSON.stringify(JSON.parse(data.toString('utf-8')).tareas[0]) === JSON.stringify(val.tareas[0])) {
				fs.writeFile('./tareas/' + materia.toString() + '.json', JSON.stringify(val, null, 4).replace('"update": true', '"update": false'), function (err) {
					if (err) { throw err };
				})
				} else {
				fs.writeFile('./tareas/' + materia.toString() + '.json', JSON.stringify(val, null, 4).replace('"update": false', '"update": true'), function (err) {
					if (err) { throw err };
				})
				}
			} catch (e) {
				fs.writeFile('./tareas/' + materia.toString() + '.json', JSON.stringify(val, null, 4).replace('"update": true', '"update": false'), function (err) {
					if (err) { throw err };
				})
			}
		});
	})
  await page2.close();
  
  await instance.exit();
};

async function postsMateria(materia) {
  const instance = await phantom.create();
  const page = await instance.createPage();
  const page2 = await instance.createPage();
  
  page.addCookie({
	name: 'XSRF-TOKEN',
	value: cookie.xsrf,
	domain: 'baja.siades.mx'
  });
  page.addCookie({
	name: 'laravel_session',
	value: cookie.laravel,
	domain: 'baja.siades.mx'
  });
  const status = await page.open('https://baja.siades.mx/setteachersubject/' + materia.toString());
  const content = await page.property('content');
  await page.close();
  
  const status2 = await page2.open('https://baja.siades.mx/subject_question');
  const content2 = await page2.property('content');
    page2.evaluate(function () {
	try {
		var postsTemp = []
		if (document.getElementsByClassName("collection border-radius-8")[0]) {
			for (var i = 0, len = document.getElementsByClassName("collection border-radius-8").length; i < len; i++) {
				postsTemp.push({autor: document.getElementsByClassName("collection border-radius-8")[i].innerText.split("\n")[1], fecha: document.getElementsByClassName("collection border-radius-8")[i].innerText.split("\n")[2], texto: document.getElementsByClassName("collection border-radius-8")[i].innerText.split("\n")[3]})
			}
		}
		return {evento: 'post', update: false, error: false, materia: document.getElementsByClassName("white-text")[0].innerText.split("\n")[0].replace(/^\s+/g, ''), grupo: document.getElementsByClassName("white-text")[0].innerText.split("\n")[1].replace(/^\s+/g, '').replace(/\s+/, "").split("/")[0].replace("TMTTM", "-TMT (MAT)"), posts: postsTemp}
	} catch (e) {
		return {error: true, update: false}
	}
    }).then(val => {
		fs.readFile('./posts/' + materia.toString() + '.json', function read(err, data) {
			try {
				if (JSON.stringify(JSON.parse(data.toString('utf-8')).posts[0]) === JSON.stringify(val.posts[0])) {
				fs.writeFile('./posts/' + materia.toString() + '.json', JSON.stringify(val, null, 4).replace('"update": true', '"update": false'), function (err) {
					if (err) { throw err };
				})
				} else {
				fs.writeFile('./posts/' + materia.toString() + '.json', JSON.stringify(val, null, 4).replace('"update": false', '"update": true'), function (err) {
					if (err) { throw err };
				})
				}
			} catch (e) {
				fs.writeFile('./posts/' + materia.toString() + '.json', JSON.stringify(val, null, 4).replace('"update": true', '"update": false'), function (err) {
					if (err) { throw err };
				})
			}
		});
	})
  await page2.close();
  
  await instance.exit();
};

module.exports = { tareasMateria, postsMateria };