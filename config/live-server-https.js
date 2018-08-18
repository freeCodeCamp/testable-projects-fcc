/**
 * Used by live-server to serve https. We use live-server for the
 * automated tests to serve up the local version of bundle.js.
 */

const selfsigned = require('selfsigned');

let attrs = [{ name: 'commonName', value: 'localhost' }];
let pems = selfsigned.generate(attrs, { days: 365 });

module.exports = {
    cert: pems.cert,
    key: pems.private
};
