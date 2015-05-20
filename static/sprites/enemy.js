(function (game) {
  game.sprites["Enemy"] = {
    init: function (p) {
      this._super(p, {
        sprite: "player",
        sheet: "player",
        x: game.Q.el.width - 60, //TODO get that 60 from the sprite's width
        y: game.Q.el.height / 2,
        angle: 180,
        type: game.Q.SPRITE_ENEMY,
        speed: 100
      });

      this.add("animation");
      this.add("RemoteAI");
      this.play("default");
      this.add("Gun");

      this.on('hit', function (col) {
        if (col.obj.isA("Shot") && (col.obj.p.type & game.Q.SPRITE_FRIENDLY) == game.Q.SPRITE_FRIENDLY && !game.Q.endGame) {
          this.destroy();
          col.obj.destroy();
          game.Q.stageScene("endGame", 2, { label: "You Won!" });
        }
      });
    },

    step: function (dt) {
      this.stage.collide(this, { collisionMask: game.Q.SPRITE_FRIENDLY });
    }
  }
})(G);