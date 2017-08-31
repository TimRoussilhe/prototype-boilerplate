var path = require('path');
var fs = require('fs');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  // appBuild: resolveApp('build'),
  // appPublic: resolveApp('public'),
  // appHtml: resolveApp('public/index.html'),
  // appIndexJs: resolveApp('src/index.js'),
  // appPackageJson: resolveApp('package.json'),
  // appSrc: resolveApp('src'),
  // testsSetup: resolveApp('src/setupTests.js'),
  // appNodeModules: resolveApp('node_modules'),
  // ownNodeModules: resolveApp('node_modules'),
  appEntryPoint: resolveApp('src/scripts/main.js'),
  appHtml: resolveApp('src/templates/index.html'),
  outputDevPath: resolveApp('public/'),
  outputProdPath: resolveApp('public/')
};