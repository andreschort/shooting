// Represents the client-side endpoint to the server exposed api
function Api(endpoint) {
  this.endpoint = endpoint;
};

// tells the server that you want to join a game
Api.prototype.join = function (peerId, game) {
  Logger.debug('Api: join %s:%s', peerId, game);
  var parameters = {
    peerId: peerId,
    name: game
  };
  
  return $.post(this.endpoint + "/join", parameters).promise();
};

Api.prototype.leave = function (peerId, game) {
  Logger.debug('Api: leave $s:$s', peerId, game);
  return $.post(this.endpoint + "/leave", { name: game, peerId: peerId }).promise();
};