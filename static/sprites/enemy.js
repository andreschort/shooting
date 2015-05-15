(function () {
  Game.sprite["Enemy"] = {
    init: function (p) {
      this._super(p, {
        sprite: "player",
        sheet: "player",
        x: Q.el.width - 60, //TODO get that 60 from the sprite's width
        y: Q.el.height / 2,
        angle: 180,
        type: Q.SPRITE_ENEMY,
        speed: 100
      });

      this.add("animation");
      this.add("RemoteAI");
      this.play("default");
      this.add("Gun");

      this.on('hit', function (col) {
        if (col.obj.isA("Shot") && (col.obj.p.type & Q.SPRITE_FRIENDLY) == Q.SPRITE_FRIENDLY && !Q.endGame) {
          this.destroy();
          col.obj.destroy();
          Q.stageScene("endGame", 2, { label: "You Won!" });
        }
      });
    },

    step: function (dt) {
      this.stage.collide(this, { collisionMask: Q.SPRITE_FRIENDLY });
    }
  }
})();