'use strict';
// Summary:
//  Build for production

const path = require('path');
const shell = require('shelljs');
const helpers = require('./cli/helpers');
const webpack = require('webpack');
const config = require('../webpack.dist.config');
const pkgJson = require('../package.json');

config.warnings = true;

// Clean folder
const buildFolder = path.join(__dirname, '../build');
shell.rm('-rf', buildFolder);
shell.mkdir(buildFolder);
shell.mkdir(`${buildFolder}/static`);

shell.cp('-R', path.join(__dirname, '../src/node'), buildFolder);
shell.rm(path.join(buildFolder, './node/main.js'));
shell.rm(path.join(buildFolder, './node/.eslintrc'));

let lines;
let i;

// lines = helpers.getLines(path.join(buildFolder, './node/main.js'));
// const openWindowLine = /win = new BrowserWindow\(\{width: \d+, height: \d+\}\)/;
// i = helpers.lineIndex(lines, openWindowLine);
// helpers.removeLines(lines, openWindowLine);
// lines.splice(i, 0, 'win = new BrowserWindow({width: 360, height: 600});');
// const loadUrlLine = /win\.loadURL\('http:\/\/localhost:\d+\/'\)/;
// i = helpers.lineIndex(lines, loadUrlLine);
// helpers.removeLines(lines, loadUrlLine);
// lines.splice(i, 0, 'win.loadURL(`file://${__dirname}/../index.html`);'); // eslint-disable-line
// helpers.removeLines(lines, 'win.webContents.openDevTools()');
// shell.ShellString(lines.join('\n')).to(path.join(buildFolder, './node/main.js'));

// The package.json for distribution
shell.ShellString(`{
  "name"    : "${pkgJson.name}",
  "productName": "${pkgJson.productName}",
  "version" : "${pkgJson.version}",
  "main"    : "./node/main.dist.js"
}
`).to(path.join(buildFolder, 'package.json'));

const timestamp = require('crypto')
  .createHash('md5')
  .update(new Date().getTime().toString())
  .digest('hex')
  .substring(0, 10);

lines = helpers.getLines(path.join(__dirname, '../src/index.html'));
helpers.removeLines(lines, '/.tmp/vendors.dll.js');
helpers.removeLines(lines, './node/bridge.js');
helpers.removeLines(lines, '/static/main.bundle.js');
i = helpers.lineIndex(lines, '</body>');
lines.splice(i, 0,
  '    <script src="./node/bridge.js"></script>',
  `    <script src="./static/main.bundle.${timestamp}.js"></script>`
);
const indexHtml = lines.join('\n');
shell.ShellString(indexHtml).to(path.join(buildFolder, 'index.html'));

console.log('Building, it may take tens of seconds...');

const start = new Date().getTime();
webpack(config, (err, result) => {
  if (err) console.log(err);
  else {
    shell.mv(path.join(buildFolder, './static/main.bundle.js'), path.join(buildFolder, `/static/main.bundle.${timestamp}.js`));
    const end = new Date().getTime();
    console.log('Done, build time: ', end - start, 'ms');
  }
});

