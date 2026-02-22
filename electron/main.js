const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
require('dotenv').config();

let mainWindow;
let tray;
let serverProcess;
const isDev = process.env.NODE_ENV === 'development';

// Configuração do auto-updater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Caminho do servidor
const SERVER_PATH = isDev 
  ? path.join(__dirname, '../server/src/server.js')
  : path.join(process.resourcesPath, 'server/src/server.js');

// Caminho das dependências do servidor
const SERVER_MODULES_PATH = isDev
  ? path.join(__dirname, '../server/node_modules')
  : path.join(process.resourcesPath, 'server/node_modules');

// Função para verificar se as dependências do servidor estão instaladas
function checkServerDependencies() {
  try {
    return fs.existsSync(SERVER_MODULES_PATH);
  } catch (error) {
    console.error('Erro ao verificar dependências:', error);
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, '../docs/LOGO ESCOLA.jpg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'SGE CENTENÁRIO - Sistema de Gestão Escolar',
    backgroundColor: '#1976d2',
    show: false
  });

  // Splash screen
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('🎓 SGE CENTENÁRIO iniciado com sucesso!');
  });

  // Carregar aplicação
  const startURL = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../client/build/index.html')}`;
  
  mainWindow.loadURL(startURL);

  // DevTools apenas em desenvolvimento
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Minimizar para bandeja ao invés de fechar
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../docs/LOGO ESCOLA.jpg'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir SGE CENTENÁRIO',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Verificar Atualizações',
      click: () => {
        checkForUpdates();
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('SGE CENTENÁRIO');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    mainWindow.show();
  });
}

async function startBackendServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando servidor backend...');
    
    // Verifica se o arquivo do servidor existe
    const fs = require('fs');
    if (!fs.existsSync(SERVER_PATH)) {
      console.error(`❌ Servidor não encontrado em: ${SERVER_PATH}`);
      // Continua mesmo sem servidor em modo degradado
      resolve();
      return;
    }
    
    try {
      serverProcess = spawn('node', [SERVER_PATH], {
        env: {
          ...process.env,
          PORT: process.env.PORT || 5000,
          NODE_ENV: isDev ? 'development' : 'production'
        },
        cwd: path.dirname(SERVER_PATH),
        stdio: ['ignore', 'pipe', 'pipe']
      });

      serverProcess.stdout.on('data', (data) => {
        console.log(`[Server]: ${data}`);
        if (data.toString().includes('Servidor rodando') || data.toString().includes('MongoDB conectado')) {
          resolve();
        }
      });

      serverProcess.stderr.on('data', (data) => {
        console.error(`[Server Error]: ${data}`);
      });

      serverProcess.on('error', (error) => {
        console.error(`[Server Process Error]: ${error.message}`);
        // Continua mesmo com erro
        resolve();
      });

      serverProcess.on('close', (code) => {
        console.log(`Servidor encerrado com código ${code}`);
        if (code !== 0 && code !== null) {
          console.warn('⚠️ Servidor encerrado com erro, mas continuando...');
        }
      });

      // Timeout de 12 segundos com mensagem mais robusta
      setTimeout(() => {
        console.log('✅ Servidor backend iniciado ou em modo standalone');
        resolve();
      }, 12000);
      
    } catch (error) {
      console.error('❌ Erro ao iniciar servidor:', error);
      // Continua mesmo com erro
      resolve();
    }
  });
}

function checkForUpdates() {
  if (isDev) {
    console.log('Updates desabilitados em desenvolvimento');
    return;
  }

  autoUpdater.checkForUpdates();
}

// Eventos do auto-updater
autoUpdater.on('checking-for-update', () => {
  console.log('🔍 Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Atualização Disponível',
    message: `Nova versão ${info.version} disponível!`,
    detail: 'Deseja baixar e instalar agora?',
    buttons: ['Sim', 'Depois'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', () => {
  console.log('✅ Sistema atualizado');
});

autoUpdater.on('download-progress', (progressObj) => {
  let message = `Baixando: ${Math.round(progressObj.percent)}%`;
  console.log(message);
  mainWindow.setProgressBar(progressObj.percent / 100);
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.setProgressBar(-1);
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Atualização Pronta',
    message: 'Atualização baixada. O sistema será reiniciado.',
    buttons: ['Reiniciar Agora']
  }).then(() => {
    setImmediate(() => autoUpdater.quitAndInstall());
  });
});

// Inicialização do app
app.whenReady().then(async () => {
  console.log('🎓 SGE CENTENÁRIO - Sistema de Gestão Escolar');
  console.log('📚 Iniciando sistema...');

  // Verifica dependências do servidor
  const hasDependencies = checkServerDependencies();
  if (!hasDependencies && !isDev) {
    console.warn('⚠️ Dependências do servidor não encontradas');
    console.log('📦 Caminho esperado:', SERVER_MODULES_PATH);
  }

  // Inicia servidor backend
  try {
    await startBackendServer();
    console.log('✅ Servidor backend iniciado');
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    // Mostra mensagem opcional, mas continua
    if (!isDev) {
      dialog.showMessageBox({
        type: 'warning',
        title: 'SGE CENTENÁRIO',
        message: 'Aviso de Inicialização',
        detail: 'O servidor backend está iniciando em segundo plano.\n\nSe houver problemas de conexão, reinicie o aplicativo.',
        buttons: ['Continuar']
      });
    }
  }

  // Aguarda um pouco para o servidor estar pronto
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Cria janela principal
  createWindow();
  createTray();

  // Verifica atualizações após 10 segundos
  setTimeout(() => {
    if (!isDev) {
      checkForUpdates();
    }
  }, 10000);
});

// Fechar servidor ao sair
app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('check-updates', () => {
  checkForUpdates();
});

console.log('🚀 SGE CENTENÁRIO carregado');
