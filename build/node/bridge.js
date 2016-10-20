'use strict';
const { ipcRenderer, shell } = require('electron');

window.bridge = {
  ipcRenderer,
  shell,
  openUrl(url) {
    shell.openExternal(url);
  }
};
