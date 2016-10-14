'use strict';

const { ipcRenderer } = require('electron');

window.bridge = {
  ipcRenderer,
};
