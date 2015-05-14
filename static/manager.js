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

  var self = this;
  this.comm = new Comm({ host: window.location.hostname, port: 9000, connected: function (id) {
    self.on.connected.dispatch(id);
  } });
  this.api = new Api(window.location.origin + '/api');
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

      var runGame = function () {
        var me = Q('Player').first();
        var enemy = Q('Enemy').first();

        if (!me || !enemy) {
          setTimeout(runGame, 1000);
          return;
        }

        self.comm.on.message.add(function (player, data) {
          enemy.p.x = data.x;
          enemy.p.y = data.y;
        });

        var meStep = me.step;
        me.step = function (dt) {
          meStep.call(me, dt);

          self.comm.broadcast({x: me.p.x, y: me.p.y });
        }
      };

      if (self.comm.playerCount() > 0) {
        self.on.started.dispatch();
        runGame();
      } else {
        self.comm.on.newPlayer.add(function (player) {
          Logger.debug('Manager: comm.onNewPlayer');

          self.on.newPlayer.dispatch(player);
          runGame();
          Logger.debug('Manager: runGame');
          self.on.started.dispatch();
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