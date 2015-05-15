(function () {
  Game.component["Gun"] = {
    added: function () {
      // Called after the component is added to the entity
      this.entity.p.shots = [];
      this.entity.p.canFire = true;
      this.entity.on('step', "handleFiring");
    },

    extend: {
      // extends entity, everything is called in the scope of the entity this component is attached to...
      handleFiring: function (dt) {

        // clean up shots array
        for (var i = this.p.shots.length - 1; i >= 0; i--) {
          if (this.p.shots[i].isDestroyed) {
            this.p.shots.splice(i, 1);
          }
        }

        if (Q.inputs['fire'] && this.p.type == Q.SPRITE_FRIENDLY) {
         this.fire(Q.SPRITE_FRIENDLY);
        }
      },
      fire: function (type) {
        if (!this.p.canFire) {
          return;
        }

        var props = {
          x: this.p.x + 50,
          y: this.p.y,
          speed: 200,
          type: Q.SPRITE_DEFAULT | Q.SPRITE_FRIENDLY,
          angle: this.p.angle
        };

        if (type == Q.SPRITE_ENEMY) {
          props.x -= 100;
          props.speed = -200;
          props.type = Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY;
        }

        this.p.shots.push(Q.stage().insert(new Q.Shot(props)));

        // fire throttling
        this.p.canFire = false;
        var entity = this;
        setTimeout(function () {
          entity.p.canFire = true;
        }, 500);

        this.trigger("fire");
      }
    }
  };
})();