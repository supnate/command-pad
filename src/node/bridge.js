'use strict';
const { ipcRenderer, shell, remote } = require('electron');
const fs = require('fs');
const path = require('path');

window.bridge = {
  ipcRenderer,
  isWin: process.platform === 'win32',
  shell,
  remote,
  fs,
  path,
  openUrl(url) {
    shell.openExternal(url);
  }
};
