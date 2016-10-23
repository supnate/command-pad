var ptyw = require('ptyw.js');

ptyw.spawn('java', ['-version'], {
  cols: 80,
  rows: 30,
  env: process.env
});
