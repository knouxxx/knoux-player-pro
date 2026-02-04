const { app, BrowserWindow, session } = require('electron');
const fs = require('fs');
const path = require('path');
const { setupDSPMainHandler } = require('./native/dsp/dspBridge');

let mainWindow = null;

function resolvePreload(preloadPath) {
  try {
    if (preloadPath && fs.existsSync(preloadPath)) return preloadPath;
    const alt1 = path.join(process.cwd(), '.webpack', 'x64', 'renderer', 'main_window', 'preload.js');
    if (fs.existsSync(alt1)) return alt1;
    const alt2 = path.join(process.cwd(), '.webpack', 'renderer', 'main_window', 'preload.js');
    if (fs.existsSync(alt2)) return alt2;
    const alt3 = path.join(__dirname, '..', '..', 'desktop', 'preload', 'preload.js');
    if (fs.existsSync(alt3)) return alt3;
    const alt4 = path.join(__dirname, 'preload.js');
    if (fs.existsSync(alt4)) return alt4;
    return preloadPath;
  } catch {
    return preloadPath;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: resolvePreload(process.env.MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY),
    },
  });

  if (process.env.MAIN_WINDOW_WEBPACK_ENTRY) {
    mainWindow.loadURL(process.env.MAIN_WINDOW_WEBPACK_ENTRY);
  } else {
    const prodHtml = path.join(__dirname, '..', '..', 'desktop', 'renderer', 'index.html');
    if (fs.existsSync(prodHtml)) {
      mainWindow.loadFile(prodHtml);
    } else {
      const publicHtml = path.join(__dirname, '..', '..', 'public', 'index.html');
      if (fs.existsSync(publicHtml)) {
        mainWindow.loadFile(publicHtml);
      } else {
        mainWindow.loadURL('data:text/html,<h1>Renderer missing</h1>');
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  setupDSPMainHandler();
  const ses = session.defaultSession;
  ses.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowed = ['notifications', 'fullscreen', 'pointerLock', 'openExternal'];
    callback(allowed.includes(permission));
  });
  createWindow();
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
