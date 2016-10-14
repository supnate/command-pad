'use strict';
const _ = require('lodash');
const { ipcMain } = require('electron');
const Config = require('electron-config');
const Convert = require('ansi-to-html');
const pkgJson = require('../../package.json');
const runCmd = require('./run_cmd');


const convert = new Convert();
const config = new Config();

function guid() {
  return 'xyxyxyxy'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

// Ensure immutable, don't know if config.get always returns new data.
const cmds = _.cloneDeep(config.get('cmds') || []);
for (const c of cmds) {
  c.outputs = [];
}

const cmdHash = {};
cmds.forEach(cmd => cmdHash[cmd.id] = cmd); // eslint-disable-line

process.on('exit', () => {
  for (const cmd of cmds) {
    if (cmd.process) {
      process.kill(-cmd.process.pid);
    }
  }
});

ipcMain.on('GET_INIT_DATA', (evt) => {
  const appVersion = config.get('appVersion') || pkgJson.version;
  evt.sender.send('SET_INIT_DATA', {
    appVersion,
    cmds,
    // cmds: cmds.map(cmd => ({
    //   id: cmd.id,
    //   name: cmd.name,
    //   cmd: cmd.cmd,
    //   status: cmd.process ? 'running' : 'stopped',
    // })),
  });
});

ipcMain.on('SAVE_CMD', (evt, data, cmdId) => {
  console.log('saving cmd');
  const cmd = { id: cmdId || guid() };
  Object.assign(cmd, {
    name: data.name,
    cmd: data.cmd,
    cwd: data.cwd || null,
    url: data.url || null,
  });
  const newCmds = config.get('cmds') || [];
  if (cmdId) {
    const i = newCmds.findIndex(c => c.id === cmdId);
    newCmds.splice(i, 1, cmd);
  } else {
    newCmds.push(cmd);
  }
  config.set('cmds', newCmds);

  // Notify UI
  const curr = cmdId ? cmds.find(c => c.id === cmdId) : { status: 'stopped', outputs: [] };
  Object.assign(curr, cmd);
  if (!cmdId) {
    cmds.push(curr);
  }

  cmdHash[cmd.id] = curr;

  evt.sender.send('CMDS_UPDATED', cmds);
  evt.sender.send('SAVE_CMD_SUCCESS', cmd);
});

ipcMain.on('RUN_CMD', (evt, cmdId) => {
  console.log('running cmd: ', cmdId);

  const cmd = cmdHash[cmdId];
  if (cmd.process) {
    // prevent from running multiple times.
    return;
  }
  const child = runCmd(cmd.cmd, cmd.cwd || null);
  cmd.process = child;

  child.stdout.pipe(process.stdout);
  let lineId = 0;
  cmd.outputs.length = 0;
  function onData(chunk) {
    const out = chunk.toString('utf8');
    for (const line of out.split('\n')) {
      if (cmd.outputs.length >= 10) cmd.outputs.unshift();
      cmd.outputs.push({
        id: `${cmdId}_${lineId++}`, //eslint-disable-line
        text: line,
      });
    }
    evt.sender.send('CMD_OUTPUT', cmdId, [].concat(cmd.outputs));
  }
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);

  child.on('close', (code) => {
    console.log('command finished: ', code);
    delete cmd.process;
    evt.sender.send('CMD_FINISHED', cmdId, code);
  });
});

ipcMain.on('STOP_CMD', (evt, cmdId) => {
  console.log('stopping cmd: ', cmdId);
  const cmd = cmdHash[cmdId];
  if (cmd.process) {
    process.kill(-cmd.process.pid);
  }
});

