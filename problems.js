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

var composeb = function (binary1, binary2) {
  return function(x, y, z) {
    return binary2(binary1(x,y),z);
  };
};
assert(composeb(add, mul)(2,3,5) === 25, 'composeb failed');

var add_once = function (func) {
  var i = 1;
  return function () {
    if (i > 1) {
      throw new Error('Already called once');
    }
    i += 1;
    return func.apply(null, Array.prototype.slice.call(arguments, 0));
  };
};
var myAddOnce = add_once(add);
assert(myAddOnce(2,3) === 5, 'add_once failed');
var failed = false;
try { myAddOnce(2,3) } catch (e) {failed = true; }
assert(failed, 'add_once failed');
assert(add_once(addy)(2,3,4) === 9, 'add_once failed');

var counterf = function (x) {
  return {
    inc: function () {
      x += 1;
      return x;
    },
    dec: function () {
      x -= 1;
      return x;
    }
  };
};
var counter = counterf(10);
assert(counter.inc() === 11, 'counterf failed');
assert(counter.inc() === 12, 'counterf failed');
assert(counter.dec() === 11, 'counterf failed');
assert(counter.dec() === 10, 'counterf failed');
assert(counter.dec() === 9, 'counterf failed');

// var revocable = function (func) {
//   var callable = true;
//   return {
//     invoke: function () {
//       if (callable) {
//         return func.apply(null, arguments);
//       }
//       throw new Error('Revoked');
//     },
//     revoke: function () {
//       callable = false;
//     }
//   };
// };
var revocable = function (func) {
  var f = func;
  func = null;
  return {
    invoke: function () {
      if (f === null) {
        throw new Error('Revoked');
      }
      return f.apply(this, arguments);
    },
    revoke: function () {
      f = null;
    }
  };
};
var temp = revocable(function (x) { return 'alert: ' + x;});
assert(temp.invoke(7) === 'alert: 7', 'revocable failed');
assert(temp.invoke(10) === 'alert: 10', 'revocable failed');
temp.revoke();
var revokeFailed = false;
try {
  temp.invoke(1);
} catch (e) {
  revokeFailed = true;
}
assert(revokeFailed, 'revocable failed');




