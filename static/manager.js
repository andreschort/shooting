function Manager() {
  this.on = {
    connected: new signals.Signal(),
    disconnected: new signals.Signal(),
    started: new signals.Signal(),
    newPlayer: new signals.Signal()
  };

  this.on.connected.memorize = true;
  this.on.disconnected.memorize = true;
  this.on.started.memorize = true;

  this.api = new Api(window.location.origin + '/api');
  this.comm = new Comm({
    host: window.location.hostname,
    port: 9000,
    connected: this.on.connected.dispatch
  });
}

Manager.prototype.start = function (game) {
  Logger.debug('Manager: start');
  var self = this;

  this.comm.on.connected.addOnce(function () {
    Logger.debug('Manager: comm.onConnected');
    self.api.join(self.comm.peer.id, game).done(function (res) {
      Logger.debug('Manager: api.join');
      self.currentGame = game;
      self.isPrimary = res.primary;
      res.peers.forEach(function (peer) {
        if (peer.online) {
          var player = self.comm.connect(peer.id);
          player.primary = peer.primary;

          if (player.primary) {
            self.primary = player;
          }
        }
      });

      if (self.comm.playerCount() > 0) {
        self.on.started.dispatch();
      } else {
        self.comm.on.newPlayer.add(function (player) {
          Logger.debug('Manager: comm.onNewPlayer');

          self.on.started.dispatch();
          self.on.newPlayer.dispatch(player);
        });
      }
    });
  });
};

// Leaves the current game and cleans up resources
Manager.prototype.destroy = function () {
  Logger.debug('Manager: destroy');
  if (this.currentGame) {
    var self = this;
    this.api.leave(this.comm.peer.id, this.currentGame).done(function (res) {
      self.currentGame = undefined;
    });
  }

  this.comm.destroy();
};