QUnit.test("Util.callIfPossible not a function", function (assert) {
  Util.callIfPossible(2, this);
  assert.ok(true, "Passed!");
});

QUnit.test("Util.callIfPossible single function", function (assert) {
  var called = false;
  var fn = function () {
    called = true;
  };
  Util.callIfPossible(fn, this);
  assert.ok(called, "Passed!");
});

QUnit.test("Util.callIfPossible single function inside array", function (assert) {
  var called = false;
  var fn = function () {
    called = true;
  };
  Util.callIfPossible([fn], this);
  assert.ok(called, "Passed!");
});

QUnit.test("Util.callIfPossible two function inside array", function (assert) {
  var called1 = false;
  var fn1 = function () {
    called1 = true;
  };

  var called2 = false;
  var fn2 = function () {
    called2 = true;
  }
  Util.callIfPossible([fn1, fn2], this);
  assert.ok(called1, "fn1 was called");
  assert.ok(called2, "fn2 was called");
});

QUnit.test("Util.callIfPossible thisArg", function (assert) {
  var thisArg = { called: false };
  var fn = function () {
    this.called = true;
  };
  Util.callIfPossible([fn], thisArg);
  assert.ok(thisArg.called, "Passed!");
});

QUnit.test("Util.callIfPossible arguments", function (assert) {
  var arg1 = { called1: false };
  var arg2 = { called2: false}
  var fn = function (p1, p2) {
    p1.called1 = true;
    p2.called2 = true;
  };
  Util.callIfPossible([fn], this, arg1, arg2);
  assert.ok(arg1.called1, "Passed!");
  assert.ok(arg2.called2, "Passed!");
});