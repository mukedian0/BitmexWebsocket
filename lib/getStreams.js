'use strict';
const superagent = require('superagent');

//add by hgr
require('superagent-proxy')(superagent);
//end
const url = require('url');
const debug = require('debug')('BitMEX:realtime-api:getStreams');

//proxyUrl = process.env.http_proxy || 'http://127.0.0.1:1087';
module.exports = function(wsEndpoint, proxyUrl, callback) {
  const parsed = url.parse(wsEndpoint);
  const httpEndpoint = url.format({
    protocol: parsed.protocol === 'wss:' ? 'https:' : 'http',
    host: parsed.host
  });

  superagent
  .get(httpEndpoint + '/api/v1/schema/websocketHelp')
  .proxy(proxyUrl)
  .end(function(err, res) {
    if (err) return callback(err);
    const streams = res.body.subscriptionSubjects;
    debug('Got streams from server: %j', streams);
    callback(null, {
      public: streams.public,
      private: streams.authenticationRequired,
      all: streams.public.concat(streams.authenticationRequired)
    });
  });
};

