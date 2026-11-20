
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    carregarSenhas: () => ipcRenderer.invoke('senhas:carregar'),

    salvarSenhas: (senhas) => ipcRenderer.invoke('senhas:salvar', senhas)
});
