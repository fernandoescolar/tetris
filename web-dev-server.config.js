const { rollupAdapter } = require('@web/dev-server-rollup');
const json =  require('@rollup/plugin-json');

module.exports = {
    port: 3000,
    nodeResolve: true,
    open: true,
    watch: true,
    appIndex: 'index.html',
    plugins: [rollupAdapter(json())],
  };