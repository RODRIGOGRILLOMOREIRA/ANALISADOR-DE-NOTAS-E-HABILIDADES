const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Versão do app
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  
  // Verificar atualizações
  checkForUpdates: () => ipcRenderer.invoke('check-updates'),
  
  // Informações do sistema
  platform: process.platform,
  isElectron: true
});

console.log('🔒 Preload script carregado - SGE CENTENÁRIO');
