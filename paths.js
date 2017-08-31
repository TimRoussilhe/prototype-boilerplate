var path = require('path');
var fs = require('fs');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  appEntryPoint: resolveApp('src/scripts/main.js'),
  appHtml: resolveApp('src/templates/index.html'),
  outputDevPath: resolveApp('public/'),
  outputProdPath: resolveApp('public/')
};