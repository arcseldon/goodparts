var unit = function (value) { return [value, ''] };

var bind = function (monadicValue, transformWithLog) {
  var value = monadicValue[0],
    log = monadicValue[1],
    result = transformWithLog(value);
  return [ result[0], log + result[1] ];
};

var pipeline = function (monadicValue, functions) {
  for (var key in functions) {
    monadicValue = bind(monadicValue, functions[key]);
  }
  return monadicValue;
};

var squared = function (x) {
  return [x * x, 'was squared.'];
};

var halved = function (x) {
  return [x / 2, 'was halved.'];
};

var result = pipeline(unit(4), [squared, halved]);
console.log(result);






