var nw_binding = require('binding').Binding.create('nw.App');
var nwNatives = requireNative('nw_natives');
var sendRequest = require('sendRequest');

var argv = null;
var dataPath;

nw_binding.registerCustomHook(function(bindingsAPI) {
  var apiFunctions = bindingsAPI.apiFunctions;
  apiFunctions.setHandleRequest('crashRenderer', function() {
    nwNatives.crashRenderer();
  });
  bindingsAPI.compiledApi.__defineGetter__('argv', function() {
    if (argv)
      return argv;
    argv = nw.App.getArgvSync();
    return argv;
  });
  apiFunctions.setHandleRequest('getArgvSync', function() {
    return sendRequest.sendRequestSync('nw.App.getArgvSync', [], this.definition.parameters, {});
  });
  apiFunctions.setHandleRequest('setProxyConfig', function() {
    sendRequest.sendRequestSync('nw.App.setProxyConfig', arguments, this.definition.parameters, {});
  });
  apiFunctions.setHandleRequest('getProxyForURL', function() {
    return nwNatives.getProxyForURL.apply(this, arguments);
  });
  apiFunctions.setHandleRequest('addOriginAccessWhitelistEntry', function() {
    nwNatives.addOriginAccessWhitelistEntry.apply(this, arguments);
  });
  apiFunctions.setHandleRequest('removeOriginAccessWhitelistEntry', function() {
    nwNatives.removeOriginAccessWhitelistEntry.apply(this, arguments);
  });
  apiFunctions.setHandleRequest('on', function(event, callback) {
      switch (event) {
      case 'open':
        nw.App.onOpen.addListener(callback);
        break;
      }
  });
  apiFunctions.setHandleRequest('getDataPath', function() {
    return sendRequest.sendRequestSync('nw.App.getDataPath', [], this.definition.parameters, {})[0];
  });
  bindingsAPI.compiledApi.__defineGetter__('dataPath', function() {
    if (!dataPath)
      dataPath = nw.App.getDataPath();
    return dataPath;
  });

});

exports.binding = nw_binding.generate();

