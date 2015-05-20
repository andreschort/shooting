(function (game) {
  game.components["Broadcaster"] = {
    added: function () {
      this.entity.on('move', "sendPosition");
      this.entity.on('fire', "sendShot");
      this.entity.p.previousPosition = { x: this.entity.p.x, y: this.entity.p.y };
    },

    extend: {
      sendPosition: function (dt) {
        if (this.p.previousPosition.x != this.p.x || this.p.previousPosition.y != this.p.y) {
          this.p.previousPosition.x = this.p.x;
          this.p.previousPosition.y = this.p.y;

          game.manager.comm.broadcast({ type: "move", x: this.p.x, y: this.p.y });
          Logger.debug('Broadcaster - sent: x=%s y=%s', this.p.x, this.p.y);
        }
      },
      sendShot: function (dt) {
        game.manager.comm.broadcast({ type: "shot" });
        Logger.debug('Broadcaster - sent: shot');
      }
    }
  };
})(G);