var _ = require('underscore');
var count = _.compose(_.size, _.filter);

/// Room class
function Room(name) {
  this.name = name;
  this.peers = [];
}

Room.prototype.get = function (id) {
  return _.find(this.peers, function (peer) { return peer.id === id; });
};

Room.prototype.add = function (peer) {
  this.peers.push(peer);

  if (!this.primary() && peer.online) {
    peer.primary = true;
  }
};

Room.prototype.primary = function () {
  return _.find(this.peers, function (peer) { return peer.primary; });
};

Room.prototype.updatePeer = function (id, online) {
  var peer = this.get(id);

  if (!peer) {
    return;
  }

  peer.online = online;

  if (peer.online) {
    peer.primary = count(this.peers, function (peer) { return peer.online; }) === 1;
  } else if (peer.primary) {
    peer.primary = false;
    var newPrimary = _.find(this.peers, function (peer) { return peer.online; });

    if (newPrimary) {
      newPrimary.primary = true;
    }
  }
};

Room.prototype.remove = function (id) {
  this.peers = _.reject(this.peers, function (peer) { return peer.id === id; });
};

/// RoomCollection class
function RoomCollection() {
  this.rooms = [];
}

RoomCollection.prototype.get = function (name) {
  return _.find(this.rooms, function (room) { return room.name === name; });
};

RoomCollection.prototype.add = function (room) {
  this.rooms.push(room);
};

RoomCollection.prototype.updatePeer = function (id, status) {
  _.each(this.rooms, function (room) {
    room.updatePeer(id, status);
  });
};

module.exports.Room = Room;
module.exports.RoomCollection = RoomCollection;