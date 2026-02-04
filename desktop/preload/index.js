const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('knouxAPI', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  on: (channel, func) => {
    ipcRenderer.on(channel, (_event, ...args) => func(...args));
  },
  off: (channel, func) => {
    ipcRenderer.removeListener(channel, func);
  },
  platform: process.platform,
});
