(function () {
  Game.scene["mainLevel"] = function (stage) {
    Q.gravity = 0;
    Q.endGame = false;
    stage.insert(new Q.Sprite({
        asset: "space_background.jpg",
        x: Q.el.width / 2,
        y: Q.el.height / 2,
        type: Q.SPRITE_NONE
      }));

    stage.insert(new Q.Player());

    stage.insert(new Q.Enemy());
    Game.manager.on('newplayer', function (player) {
      stage.insert(new Q.Enemy({ player: player }));
    });
  }
})();