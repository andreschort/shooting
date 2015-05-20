(function (game) {
  game.scenes["mainLevel"] = function (stage) {
    game.Q.gravity = 0;
    game.Q.endGame = false;
    stage.insert(new game.Q.Sprite({
        asset: "space_background.jpg",
        x: game.Q.el.width / 2,
        y: game.Q.el.height / 2,
        type: game.Q.SPRITE_NONE
      }));

    stage.insert(new game.Q.Player());
    stage.insert(new game.Q.Enemy());
  }
})(G);