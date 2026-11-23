
const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const repositorio = require('./repositorio');

let janelaPrincipal;

function criarJanela() {
    janelaPrincipal = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    janelaPrincipal.loadFile(path.join(__dirname, 'src', 'index.html'));
}

function criarMenu() {
    const modeloMenu = [
        {
            label: 'Arquivo',
            submenu: [
                {
                    label: 'Novo cadastro',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        janelaPrincipal.loadFile(
                            path.join(__dirname, 'src', 'telas', 'novo-cadastro.html')
                        );
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Sair',
                    accelerator: 'Alt+F4',
                    click: () => {
                        janelaPrincipal.close();
                    }
                }
            ]
        },
        {
            label: 'Ajuda',
            submenu: [
                {
                    label: 'Sobre o SenhaForte',
                    click: async () => {
                        await dialog.showMessageBox(janelaPrincipal, {
                            type: 'info',
                            title: 'Sobre o SenhaForte',
                            message: 'SenhaForte - Gerenciador de Senhas',
                            detail: 'Aplicação desktop desenvolvida com Electron, HTML, CSS e JavaScript.'
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(modeloMenu);

    Menu.setApplicationMenu(menu);
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
    criarMenu();

});
