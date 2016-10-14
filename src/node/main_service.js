'use strict';

const { ipcMain } = require('electron');
var Convert = require('ansi-to-html');
var convert = new Convert();
const runCmd = require('./run_cmd');

const cmds = [
  {
    id: 'nodeVersion',
    name: 'node version',
    cmd: 'node --version',
    cwd: '',
    link: '',
    outputs: [],
  },
  {
    id: 'app1:test',
    name: 'app1:test',
    cmd: 'npm run test',
    cwd: '/Users/i305656/workspace/app1',
    link: '',
    outputs: [],
  },
  {
    id: 'app1:start',
    name: 'app1:start',
    cmd: 'npm run start',
    cwd: '/Users/i305656/workspace/app1',
    link: '',
    outputs: [],
  },
  {
    id: 'ping',
    name: 'ping baidu.com',
    cmd: 'ping baidu.com',
    outputs: [],
  },
];

const cmdHash = {};
cmds.forEach(cmd => cmdHash[cmd.id] = cmd); // eslint-disable-line

ipcMain.on('GET_INIT_DATA', (evt) => {
  evt.sender.send('SET_INIT_DATA', {
    appVersion: '1.0.0',
    cmds: cmds.map(cmd => ({
      id: cmd.id,
      name: cmd.name,
      cmd: cmd.cmd,
      status: cmd.process ? 'running' : 'stopped',
    })),
  });
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

