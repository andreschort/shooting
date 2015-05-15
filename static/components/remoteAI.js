(function () {
  Game.component["RemoteAI"] = {
    added: function () {
      var entity = this.entity;
      Game.manager.comm.on.message.add(function (player, data) {
        if (data.type === "move") {
          Logger.debug('RemoteAI: - received data: x=%s y=%s', data.x, data.y);
          entity.p.x = Q.el.width - data.x;
          entity.p.y = data.y;
        } else if (data.type === "shot") {
          Logger.debug('RemoteAI: received data: shot');
          entity.fire(Q.SPRITE_ENEMY);
        }
      });
    },

    extend: {

    }
  };
})();