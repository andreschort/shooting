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
    callIfPossible: function (fn, thisArg) {
      var arr = fn;

      if (!Array.isArray(fn)) {
        arr = [fn];
      }

      var args = [].splice.call(arguments, 2);
      arr.forEach(function (fn) {
        if (isFunction(fn)) {
          return fn.apply(thisArg, args);
        }
      });
    },
    extend: function (o1, o2) {
      var result = {};
      Object.keys(o1).forEach(function (key1) {
        result[key1] = o1[key1];
      });

      Object.keys(o2).forEach(function (key2) {
        result[key2] = o2[key2];
      });

      return result;
    }
  };
})();