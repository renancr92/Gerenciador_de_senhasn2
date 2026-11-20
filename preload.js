
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    enviarMensagem: (texto) => ipcRenderer.invoke('mensagem-main', texto)
});
