
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
    carregarSenhas: () => ipcRenderer.invoke('senhas:carregar'),

    salvarSenhas: (senhas) => ipcRenderer.invoke('senhas:salvar', senhas),

    excluirSenha: (indiceRegistro) => ipcRenderer.invoke('senhas:excluir', indiceRegistro)
});
