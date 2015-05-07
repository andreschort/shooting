// Represents the client-side endpoint to the server exposed api
function Api(endpoint) {
  this.endpoint = endpoint;
};

// tells the server that you want to join a game
Api.prototype.join = function (peerId, gameName) {
  var parameters = {
    peerId: peerId,
    name: gameName,
  };
  
  return $.post(this.endpoint + "/join", parameters).promise();
};