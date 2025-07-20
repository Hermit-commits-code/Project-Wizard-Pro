const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { generateProject } = require('./generate');
const { initGitRepo } = require('./git');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadURL('http://localhost:3000');
}

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('generate-project', async (event, args) => {
  const { projectName, stack, configs, outDir, git } = args;
  generateProject({ projectName, stack, configs, outDir });
  if (git) initGitRepo(outDir);
  return true;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
