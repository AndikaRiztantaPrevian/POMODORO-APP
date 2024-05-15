// Preload digunakan untuk komunikasi FrontEnd ke BackEnd
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sendFormSubmission: (data) => {
    ipcRenderer.send('form-submission', data);
  }
});
