'use strict';
const path = require('path');
const _ = require('lodash');
const child_process = require('child_process');
const { app, dialog, ipcMain, nativeImage, Notification } = require('electron');
const Config = require('electron-config');
const notifier = require('node-notifier');

const spawn = child_process.spawn;
const exec = child_process.exec;
const Convert = require('ansi-to-html');
// const Sudoer = require('electron-sudo').default;
// const runCmd = require('./run_cmd');

const convert = new Convert();
const config = new Config();

const isWin = process.platform === 'win32';

const iconSuccessPath = path.join(__dirname, '../images/iconSuccess.png');
const iconErrorPath = path.join(__dirname, '../images/iconError.png');
// const iconSuccess = nativeImage.createFromPath(path.join(__dirname, '../images/iconSuccess.png'));
// const iconError = nativeImage.createFromPath(path.join(__dirname, '../images/iconError.png'));

notifier.on('click', () => {
  console.log('notifier on click');
  global.CP_WIN.show();
});

function guid() {
  return 'xyxyxyxy'.replace(/[xy]/g, (c) => {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); // eslint-disable-line
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

function stopCmd(cmd) {
  console.log('stopping cmd: ', cmd.id);
  if (!cmd || !cmd.process) return;
  try {
    if (isWin) {
      console.log('pid: ', cmd.process.pid);
      child_process.exec('taskkill /pid ' + cmd.process.pid + ' /T /F');
    } else {
      cmd.process.destroy();
    }
  } catch (e) {
    console.log('failed to kill the process: ', e);
  }
}

function stopAllCmds() {
  console.log('app will quit.');
  for (const cmd of cmds) {
    if (cmd.process) {
      stopCmd(cmd);
    }
  }
}

function getEnvPath() {
  let envPath = config.get('envPath');
  if (envPath) {
    if (isWin) {
      envPath = ';' + envPath;
    } else {
      envPath = ':/usr/local/bin:/usr/local/sbin:/usr/local/share/npm/bin:/usr/local/share/node/bin:' + envPath;
    }
  } else {
    envPath = ':/usr/local/bin:/usr/local/sbin:/usr/local/share/npm/bin:/usr/local/share/node/bin';
  }
  return envPath;
}

module.exports = {
  appWillQuit: stopAllCmds
};

function getOutputRowsLimit() {
  return config.get('outputRowsLimit') || 100;
}
/* ==================== Get Init Data ============================== */
ipcMain.on('GET_INIT_DATA', (evt) => {
  evt.sender.send('SET_INIT_DATA', {
    appVersion: app.getVersion(),
    envPath: config.get('envPath'),
    outputRowsLimit: getOutputRowsLimit(),
    isWin,
    cmds: cmds.map(c => Object.assign(_.pick(c, ['id', 'name', 'cmd', 'cwd', 'sudo', 'outputs', 'url', 'finishPrompt']), { status: c.process ? 'running' : 'stopped' })),
  });
});


/* ==================== Save Command ============================== */
ipcMain.on('SAVE_CMD', (evt, data, cmdId) => {
  console.log('saving cmd');
  const cmd = { id: cmdId || guid() };
  Object.assign(cmd, {
    name: data.name,
    cmd: data.cmd,
    sudo: data.sudo,
    finishPrompt: data.finishPrompt,
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
  evt.sender.send('SAVE_CMD_SUCCESS', cmd);
});

/* ==================== Delete Command ============================== */
ipcMain.on('DELETE_CMD', (evt, cmdId) => {
  console.log('deleting cmd');
  // Stop the process if needed
  const cmd = cmdHash[cmdId];
  if (cmd.process) {
    stopCmd(cmd);
  }
  // Save to config
  const newCmds = config.get('cmds') || [];
  _.remove(newCmds, c => c.id === cmdId);
  config.set('cmds', newCmds);

  // Remove from store
  _.remove(cmds, c => c.id === cmdId);
  delete cmdHash[cmdId];

  evt.sender.send('DELETE_CMD_SUCCESS', cmdId);
});

/* ==================== Reorder Commands ============================== */
ipcMain.on('REORDER_CMDS', (evt, cmdIds) => {
  console.log('reordering cmds');

  // Save to config
  let newCmds = config.get('cmds') || [];
  const groups = _.groupBy(newCmds, 'id');
  newCmds = cmdIds.map(id => groups[id][0]);
  config.set('cmds', newCmds);

  // Update store order
  for (let i = 0; i < cmds.length; i++) {
    cmds[i] = cmdHash[cmdIds[i]];
  }

  evt.sender.send('REORDER_CMDS_SUCCESS', cmdIds);
});

/* ==================== Run Command ============================== */
ipcMain.on('RUN_CMD', (evt, cmdId, password) => { // eslint-disable-line
  const cmd = cmdHash[cmdId];
  console.log('running cmd: ', cmd.cmd);

  // notify the UI to show command is running. TODO: maybe use sync action is enough
  evt.sender.send('RUN_CMD_SUCCESS', cmdId);
  if (cmd.process) {
    // prevent from running multiple times.
    return;
  }

  let lineId = 0;
  cmd.outputs.length = 0;
  function onData(chunk, term) {
    let out = chunk.toString('utf8');

    if (!isWin) {
      if (/sorry.*try.*again.*/i.test(out)) {
        cmd.outputs.push({
          id: `${cmdId}_${lineId++}`, //eslint-disable-line
          text: '<span style="color: red">Password is incorrect.</span>',
        });
        evt.sender.send('CMD_OUTPUT', cmdId, [].concat(cmd.outputs));
        term.destroy();
        return;
      }

      if (cmd.sudo && /password/i.test(out)) {
        term.write(`${password}\r`);
        return;
      }
    }

    out = out.replace(/[\n\r]$/, '');
    const lines = out.split('\n');
    const rowsLimit = getOutputRowsLimit();
    for (const line of lines) {
      let text = line.replace(/>/g, '&gt;').replace(/</g, '&lt;');
      if (!isWin) text = convert.toHtml(text);
      cmd.outputs.push({
        id: `${cmdId}_${lineId++}`, //eslint-disable-line
        text,
      });
      if (cmd.outputs.length >= rowsLimit) {
        cmd.outputs.splice(0, cmd.outputs.length - rowsLimit);
      }
    }
    evt.sender.send('CMD_OUTPUT', cmdId, [].concat(cmd.outputs));
  }

  function onExit(code) {
    delete cmd.process;
    delete cmd._manualStop;
    if (!cmd._manualStop && cmd.finishPrompt) {
      notifier.notify({ // eslint-disable-line
        title: 'Command finished',
        message: `Command ${code > 0 ? 'failed' : 'finished'}: ${cmd.name} .`,
        icon: code > 0 ? iconErrorPath : iconSuccessPath,
        wait: true,
      });
    }
    evt.sender.send('CMD_FINISHED', cmdId, code);
  }

  let arr = cmd.cmd.match(/'[^']*'|"[^"]*"|[^ ]+/g) || [];
  arr = arr.map(m => m.replace(/^['"]|['"]/g, ''));

  const envPath = getEnvPath();
  if (isWin) {
    // use cmd.exe to execute command
    arr = ['/s', '/c'].concat(arr);
    const child = spawn('cmd', arr, {
      cwd: cmd.cwd || process.env.HOME,
      stdio: 'pipe',
      env: Object.assign({}, process.env, { Path: `${process.env.Path}${envPath}` }),
    });
    child.stdout.pipe(process.stdout);
    cmd.process = child;
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', onExit);
    child.on('error', () => onExit(99));
  } else {
    // use ptyw.js to execute command
    let target;
    if (cmd.sudo) {
      target = 'sudo';
    } else {
      target = arr.shift();
    }
    const ptyw = require('ptyw.js');

    const term = ptyw.spawn(target, arr, {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: cmd.cwd || process.env.HOME,
      detached: true,
      env: Object.assign({}, process.env, { PATH: `${process.env.PATH}${envPath}` }),
    });
    term.on('data', onData);
    term.on('exit', onExit);
  }
});

/* ==================== Stop Command ============================== */
ipcMain.on('STOP_CMD', (evt, cmdId) => {
  console.log('stopping cmd: ', cmdId);
  const cmd = cmdHash[cmdId];

  if (cmd.process) {
    cmd._manualStop = true;
    stopCmd(cmd);
  }
});

/* ==================== Save Settings ============================== */
ipcMain.on('SAVE_SETTINGS', (evt, data) => {
  console.log('save settings');
  config.set('envPath', data.envPath);
  config.set('outputRowsLimit', parseInt(data.outputRowsLimit, 10) || 100);
  evt.sender.send('SAVE_SETTINGS_SUCCESS');
});


/* ==================== Save Settings ============================== */
ipcMain.on('CLEAR_OUTPUT', (evt, cmdId) => {
  console.log('clear output');
  const cmd = cmdHash[cmdId];
  cmd.outputs.length = 0;
  evt.sender.send('CLEAR_OUTPUT_SUCCESS');
});

