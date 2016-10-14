'use strict';

const spawn = require('child_process').spawn;
const { ipcMain } = require('electron');

module.exports = function(cmd, cwd) {
  console.log('running cmd: ', cmd);
  const arr = cmd.split(' ').filter(item => !!item);
  const app = arr.shift();
  return spawn(app, arr, {
    cwd,
    stdio: 'pipe',
    detached: true,
  });
  // const promise = new Promise((resolve, reject) => {
  //   p.on('close', (code) => {
  //     console.log(`child process exited with code ${code}`);
  //     resolve(code);
  //   });
  // });

  // return {
  //   process: p,
  //   promise,
  // };
};
