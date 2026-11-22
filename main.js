
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const repositorio = require('./repositorio');

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

app.whenReady().then(() => {
    repositorio.configurarRepositorio(path.join(__dirname, 'dados'));

    ipcMain.handle('senhas:carregar', async () => {
        return await repositorio.carregarSenhas();
    });

    ipcMain.handle('senhas:salvar', async (event, senhas) => {
        await repositorio.salvarSenhas(senhas);
        return true;
    });

    criarJanela();
});
