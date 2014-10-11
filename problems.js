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

var inc_0 = addf(1);
var inc_1 = curry(add, 1);
var inc_2 = applyf(add)(1);
var inc_3 = identity(curry(add,1));

assert(inc_0(5) === 6, 'inc_0 failed');
assert(inc_0(inc_0(5)) === 7, 'inc_0 failed');
assert(inc_1(5) === 6, 'inc_1 failed');
assert(inc_1(inc_1(5)) === 7, 'inc_1 failed');
assert(inc_2(5) === 6, 'inc_2 failed');
assert(inc_2(inc_2(5)) === 7, 'inc_2 failed');
assert(inc_3(5) === 6, 'inc_3 failed');
assert(inc_3(inc_3(5)) === 7, 'inc_3 failed');

var methodize = function (binary) {
  return function (x) {
    return binary.call(null,this, x);
  };
};

Number.prototype.add = methodize(add);
Number.prototype.mul = methodize(mul);
assert((3).add(4) === 7, 'methodize failed');
assert((3).mul(4) === 12, 'methodize failed');

var demethodize = function (method) {
  return function (x, y) {
    return method.call(x,y);
  };
};
assert(demethodize(Number.prototype.add)(5, 6) === 11, 'demethodize failed');
assert(demethodize(Number.prototype.mul)(5, 6) === 30, 'demethodize failed');

var twice = function (binary) {
  return function (x) {
    return binary(x, x);
  };
};
var double = twice(add);
var square = twice(mul);
assert(double(11) === 22, 'twice failed');
assert(square(11) === 121, 'twice failed');

var composu = function (unary1, unary2) {
  return function (x) {
    return unary2(unary1(x));
  };
};
assert(composu(double, square)(3) === 36, 'composu failed');







