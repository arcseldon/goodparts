var MONAD = function (modifier) {
  var prototype = Object.create(null);
  var unit = function (value) {
    var monad = Object.create(prototype);
    monad.bind = function (func, args) {
      return func.apply(undefined,
                        [value].concat(Array.prototype.slice.apply(args || [])));
    };
    if (typeof modifier === 'function') {
      modifier(monad, value);
    }
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

var maybe = MONAD(function (monad, value) {
  if (value === null || value === undefined) {
    monad.is_null = true;
    monad.bind = function () {
      return monad;
    };
  }
});

var alert = function (message) {
  console.log('alert: ' + message);
};

// var monad = maybe('hello world');
var monad = maybe(null);
monad.bind(alert);




