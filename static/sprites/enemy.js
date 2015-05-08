(function () {
  Game.sprite["Enemy"] = {
    init: function (p) {
      this._super(p, {
        sprite: "player",
        sheet: "player",
        y: Q.el.height / 2,
        angle: p.player.primary ? 0 : 180,
        type: Q.SPRITE_ENEMY,
        speed: 100
      });

      this.p.x = p.player.primary ? 60 : Q.el.width - 60;
      this.add("animation");
      this.play("default");
      //this.add("BasicAI");
      this.on('hit', function (col) {
        if (col.obj.isA("Shot") && (col.obj.p.type & Q.SPRITE_FRIENDLY) == Q.SPRITE_FRIENDLY && !Q.endGame) {
          this.destroy();
          col.obj.destroy();
          Q.stageScene("endGame", 2, { label: "You Won!" });
        }
      });

      var self = this;
      p.player.on('message', function (msg) {
        self.p.x = msg.msg.x;
        self.p.y = msg.msg.y;
      });
    },

    step: function (dt) {
      this.stage.collide(this, { collisionMask: Q.SPRITE_FRIENDLY });
    }
  }
})();