
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


    repositorio.configurarRepositorio(app.getPath('userData'));


    ipcMain.handle('senhas:carregar', async () => {
        return await repositorio.carregarSenhas();
    });

    ipcMain.handle('senhas:salvar', async (event, senhas) => {
        await repositorio.salvarSenhas(senhas);
        return true;
    });


    ipcMain.handle('senhas:excluir', async (event, indiceRegistro) => {
        const senhas = await repositorio.carregarSenhas();

        if (
            !Number.isInteger(indiceRegistro) ||
            indiceRegistro < 0 ||
            indiceRegistro >= senhas.length
        ) {
            return false;
        }

        const registro = senhas[indiceRegistro];

        const resultado = await dialog.showMessageBox(janelaPrincipal, {
            type: 'warning',
            title: 'Confirmar exclusão',
            message: `Deseja excluir a senha de "${registro.nomeServico}"?`,
            detail: 'Esta ação não poderá ser desfeita.',
            buttons: ['Cancelar', 'Excluir'],
            defaultId: 0,
            cancelId: 0
        });

        if (resultado.response !== 1) {
            return false;
        }

        senhas.splice(indiceRegistro, 1);

        await repositorio.salvarSenhas(senhas);

        return true;
    });


    criarJanela();
    criarMenu();

});
