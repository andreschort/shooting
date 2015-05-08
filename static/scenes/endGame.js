(function () {
  Game.scene["endGame"] = function (stage) {
    Q.endGame = true;
    var container = stage.insert(new Q.UI.Container({
      x: Q.width / 2,
      y: Q.height / 2,
      fill: "#FFFFFF"
    }));

    var button = container.insert(new Q.UI.Button({
      x: 0,
      y: 0,
      fill: "#CCCCCC",
      label: "Play again"
    }));

    container.insert(new Q.UI.Text({
      x: 10,
      y: -10 - button.p.h,
      label: stage.options.label
    }));

    button.on('click', function () {
      Q.clearStages();
      Q.stageScene("mainLevel");
    });

    container.fit(20);
  };
})();