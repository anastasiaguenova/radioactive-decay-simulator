'use strict';
const electron = require('electron');

const app = electron.app;
const ipc = require('electron').ipcMain

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 770,
		minWidth: 650,
		height: 700,
		minHeight: 650,
		frame: true
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});

ipc.on('calculate-nucleus-random-decay', function (event, arg) {
	var results = []
	var nucleusCount = Number(arg)
	console.log(`nucleus count is ${nucleusCount}`)
	var temp = nucleusCount

	while(nucleusCount > 1){
		var start = nucleusCount
		for (var i = 0; i < temp; i++) { 
			var random = Math.floor(Math.random() * 100) + 1
			if(random < 50){
				nucleusCount--
			}
		}

		// Don't allow for no decay to occur during a halflife period 
		if(start = nucleusCount){
			nucleusCount--
		}

		temp = nucleusCount
		results.push(nucleusCount)
	}

	event.sender.send('nucleus-decay-random-reply', results)
	// console.log("response sent!")
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
