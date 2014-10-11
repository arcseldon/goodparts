var assert = require('assert');
var identity = function (x) {
  return x;
};
// assert(identity(1) === 1, 'identity failed');

var add = function (a, b) {
  return a + b;
};
assert(add(2,3) === 5, 'add failed');

var mul = function (a, b) {
  return a * b;
};

assert(mul(2,3) === 6, 'mul failed');

var identityf = function (x) {
  return function () {
    return x;
  };
};
assert(identityf(3)() == 3, 'identifyf failed');

var addf = function (x) {
  return function (y) {
    return x + y;
  };
};
assert(addf(3)(4) == 7, 'addf failed');

var applyf = function (binary) {
  return function (x) {
    return function (y) {
      return binary(x, y);
    };
  };
};
assert(applyf(add)(3)(4) == 7, 'applyf failed');
assert(applyf(mul)(5)(6) == 30, 'applyf failed');

var curry = function(binary, x) {
  return function (y) {
    return binary(x,y);
  };
};
assert(curry(add,3)(4) == 7, 'curry failed');
assert(curry(mul,5)(6) == 30, 'curry failed');

var addy = function (x,y,z) {
  return x + y + z;
};

var muly = function (w,x,y,z) {
  return w * x * y * z;
};

var curryf = function (func) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function () {
    return func.apply(null, args.concat(Array.prototype.slice.call(arguments,0)));
  };
};

assert(curryf(addy,3,4)(3) === 10, 'curryf failed');
assert(curryf(muly,3,4,5)(6) === 360, 'curryf failed');

var inc = curry(add, 1);

assert(inc(5) === 6, 'inc failed');


