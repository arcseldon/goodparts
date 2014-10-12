function MONAD() {
  return function unit (value) {
    var monad = Object.create(null);
    monad.bind = function (func) {
      return func(value);
    };
    return monad;
  };
}

var alert = function (msg) {
  console.log(msg);
};

var identity = MONAD();
var monad = identity('Hello world');
monad.bind(alert);

// axioms
//
// unit(value).bind(f) === f(value)
//
// monad.bind(unit) === monad
//
// monad.bind(f).bind(g)
// ===
// monad.bind(function (value) {
//  return f(value).bind(g);
//})
//