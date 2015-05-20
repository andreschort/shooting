(function (game) {
  game.components["RemoteAI"] = {
    added: function () {
      var entity = this.entity;
      game.manager.comm.on.message.add(function (player, data) {
        if (data.type === "move") {
          Logger.debug('RemoteAI: - received data: x=%s y=%s', data.x, data.y);
          entity.p.x = game.Q.el.width - data.x;
          entity.p.y = data.y;
        } else if (data.type === "shot") {
          Logger.debug('RemoteAI: received data: shot');
          entity.fire(game.Q.SPRITE_ENEMY);
        }
      });
    },

    extend: {

    }
  };
})(G);