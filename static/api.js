function Api(endpoint) {
  this.endpoint = endpoint;
};

Api.prototype.join = function (peerId, gameName) {
  var parameters = {
    peerId: peerId,
    name: gameName,
  };
  
  return $.post(this.endpoint + "/join", parameters).promise();
};