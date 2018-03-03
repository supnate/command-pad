const path = require('path');
const { app, dialog, shell, nativeImage } = require('electron');
const request = require('request');
const compareVersion = require('node-version-compare');
console.log(dialog)

module.exports = function () {
  request('http://supnate.github.io/command-pad-dist/package.json', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      try {
        const pkg = JSON.parse(body);
        console.log('latest version: ', pkg.version);
        console.log('current version: ', app.getVersion());
        if (compareVersion(app.getVersion(), pkg.version) < 0) {
          const clicked = dialog.showMessageBox({
            title: 'Update',
            message: 'A new verion of Command Pad is available. Download now?',
            buttons: ['Ok', 'Cancel'],
            icon: nativeImage.createFromPath(path.join(__dirname, '../images/dialogIcon.png')),
            defaultId: 0,
          });

          if (clicked === 0) {
            shell.openExternal('https://github.com/supnate/command-pad');
          }
        }
      } catch(e) {}
    }
  });
}
