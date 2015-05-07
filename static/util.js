(function (){
  var isFunction = function (o) {
    var getType = {};
    return o && getType.toString.call(o) === '[object Function]';
  };

  Util = {
    clamp: function (x, min, max) {
      return x < min ? min : (x > max ? max : x);
    },
    isFunction: isFunction,
    callIfPossible: function (fn) {
      if (isFunction(fn)) {
        return fn();
      }
    }
  };
})();