(function (game) {
  game.scenes["endGame"] = function (stage) {
    game.Q.endGame = true;
    var container = stage.insert(new game.Q.UI.Container({
      x: game.Q.width / 2,
      y: game.Q.height / 2,
      fill: "#FFFFFF"
    }));

    var button = container.insert(new game.Q.UI.Button({
      x: 0,
      y: 0,
      fill: "#CCCCCC",
      label: "Play again"
    }));

    container.insert(new game.Q.UI.Text({
      x: 10,
      y: -10 - button.p.h,
      label: stage.options.label
    }));

    button.on('click', function () {
      game.Q.clearStages();
      game.Q.stageScene("mainLevel");
    });

    container.fit(20);
  };
})(G);