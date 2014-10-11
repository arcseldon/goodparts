var MONAD = function () {
  return function unit(value) {
    var monad = Object.create(null);
    monad.bind = function (func) {
      return func(value);
    };
    return monad;
  };
};

var alert = function (message) {
  console.log('alert: ' + message);
};

var unit = MONAD();
var monad = unit('Hello world');
monad.bind(alert);
