
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function criarJanela() {
    const janela = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    janela.loadFile(path.join(__dirname, 'src', 'index.html'));
}

ipcMain.handle('mensagem-main', (event, texto) => {
    return 'Mensagem recebida pelo Main: ' + texto;
});

app.whenReady().then(criarJanela);
