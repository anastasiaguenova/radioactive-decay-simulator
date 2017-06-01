'use strict';

// Константа, която дава достъп до основни параметри на Electron приложението като например IPC или самия прозорец. 
const electron = require('electron');

const app = electron.app;
const ipc = require('electron').ipcMain

// Функция по подразбиране: Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Функция по подразбиране: Prevent window being garbage collected
let mainWindow;


// Функцията, която Electron повиква, когато е готов със зареждането на основните файлове. Това е началото на програмата - първата фунцкия, която се изпълнява. 
// Използваме я за създаване на прозореца чрез функция createmMainWindow()
app.on('ready', () => {
	mainWindow = createMainWindow();
});

// Функция, която Electron повиква, когато е активиран. Може да се повика когато приложението се пусне за пръв път, направи се опит то да бъде заредено 
// повторно когато вече върви, или когато се върне приложението от минимизиране. 
app.on('activate', () => {
	// Ако още няма прозорец, сега го създаваме
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

// Функция по подразбиране за създаване на главния прозорец
function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 770,
		minWidth: 650,
		height: 700,
		minHeight: 650,
		frame: true
	});

	// Показваме на .JS файла къде се намира .HTML файла с който трябва да си говори. 
	win.loadURL(`file://${__dirname}/index.html`);

	win.on('closed', onClosed);

	return win;
}

// Функция, която Electron повиква когато приложението се затвори. Премахваме стойността на променливата, която държи прозореца. 
function onClosed() {
	// Коментари по подразбиране
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

// Функция, която Electron повиква когато всички прозорци на приложението се затворят. Това приложение има само един прозорец. 
app.on('window-all-closed', () => {
	// Код по подразбиране
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// Този код се задейства когато javascript частта от .HTML файла подаде указания на index.js файла с код "nucleus-decay-random-reply"
// който сигнализира поискване на резултати от алгоритъма.  
// event променливата съдържа информация за "събитието" което е предизвикало изпълнението на кода (не се използва)
// arg променливата помещава съдържанието на полето в .HTML файла. 
ipc.on('calculate-nucleus-random-decay', function (event, arg) {
	// Създаваме масив, който да помещава резултатите от алгоритъма
	var results = []
	// Превръщаме съдържанието на полето от .HTML файла в число чрез Number().
	// TODO: Този ред ще даде грешка, ако някой въведе текст, а не число. 
	var nucleusCount = Number(arg)

	// Временна променлива, която да помещава текущия оставащ брой неразпаднали се ядра. 
	var temp = nucleusCount

	// Докато все още имаме ядра...
	while(nucleusCount > 1){
		// Променлива, която да помещава началния брой ядра за тази итерация.
		var start = nucleusCount

		// За всяко едно неразпаднало се ядро...
		for (var i = 0; i < temp; i++) { 
			// Math.random() - Създай псевдо-случанйо число от 0 до 1.
			// Умножаваме по 100 и добавяме 1 за нагледност - числата сега са от 0 до 100. 
			// Math.floor() - Закръгли числото надолу, за да не боравим с десетични стойности. 
			var random = Math.floor(Math.random() * 100) + 1

			// Ако числото е по-малко от 50... Симулираме 50/50 шанс.
			if(random < 50){
				// ... ядрото се разпада
				nucleusCount--
				// ако не е по-малко от 50, ядрото не се разпада.
			}
		}

		// Ако стартовия брой ядра е същия като текущия, изкуствено намаляваме с едно, за да няма период на полуразпад без разпаднали се ядра. 
		if(start = nucleusCount){
			nucleusCount--
		}

		// Временната променлива приема стойността на текущия брой оцелели ядра.
		// Втора променлива е нужна, защото в противен случай вадим ядра от една променлива. 
		// Това не ни позволява точно да преминем през всички ядра.  
		temp = nucleusCount

		// Добавяме текущия брой неразпаднали се ядра в масива, който помещава резултатите. 
		results.push(nucleusCount)
	}

	// Изпращаме резултатите към .HTML файла, който е и изпращач на събитието. 
	// event.sender = този, който е изпратил събитието (HTML файла)
	event.sender.send('nucleus-decay-random-reply', results)
})

ipc.on('calculate-nucleus-formula-decay', function (event, arg) {
	var results = []
	var nucleusCount = Number(arg)
	console.log(`nucleus count is ${nucleusCount}`)
	var counter = 1
	var temp = nucleusCount
	while(temp > 1){
		temp = nucleusCount * (Math.pow(2,(-1*counter)))
		results.push(parseInt(temp))
		counter++
	}

	event.sender.send('nucleus-decay-formula-reply', results)
})
