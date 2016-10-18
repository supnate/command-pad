'use strict';
const { ipcRenderer, shell } = require('electron');

window.bridge = {
  ipcRenderer,
  isWin: process.platform === 'win32',
  shell,
  openUrl(url) {
    shell.openExternal(url);
  }
};
