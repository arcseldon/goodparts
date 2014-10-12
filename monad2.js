var MONAD = function () {
  var prototype = Object.create(null);
  var unit = function (value) {
    var monad = Object.create(prototype);
    monad.bind = function (func, args) {
      return func.apply(undefined,
                        [value].concat(Array.prototype.slice.apply(args || [])));
    };
    return monad;
  };

  unit.method = function (name, func) {
    prototype[name] = func;
    return unit;
  };
  
  unit.lift = function (name, func) {
    prototype[name] = function () {
      return unit(this.bind(func, arguments));
    };
    return unit;
  }

  return unit;
};

var alert = function (message) {
  console.log('alert: ' + message);
  // return 'alert: ' + message;
}

var ajax = MONAD().lift('alert', alert);

var monad = ajax('Hello world.');

monad.bind(alert);

monad.alert();





