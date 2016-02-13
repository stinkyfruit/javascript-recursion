// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {

// source - https://gist.github.com/Cfeusier/49601da6cc409df4263b

  // setup
  var idx = 0;
  var cc = ' ';
  var escapee = {
    '"':  '"',
    '\\': '\\',
    '/':  '/',
    b:    '\b',
    f:    '\f',
    n:    '\n',
    r:    '\r',
    t:    '\t'
  };

  // handle skipping
  var next = function(c) {
    if (c && c !== cc) throw new SyntaxError();
    cc = json.charAt(idx);
    idx += 1;
    return cc;
  };

  // handle whitespace
  var white = function() {
    while (cc && cc <= ' ') next();
  };

  // handle number parsing
  var number = function() {
    var number;
    var string = '';

    if (cc === '-') {
      string = '-';
      next('-');
    }
    while (cc >= '0' && cc <= '9') {
      string += cc;
      next();
    }
    if (cc === '.') {
      string += '.';
      while (next() && cc >= '0' && cc <= '9') {
        string += cc;
      }
    }
    if (cc === 'e' || cc === 'E') {
      string += cc;
      next();
      if (cc === '-' || cc === '+') {
        string += cc;
        next();
      }
      while (cc >= '0' && cc <= '9') {
        string += cc;
        next();
      }
    }
    number = Number(string);
    if (!isFinite(number)) throw new SyntaxError("Bad number");
    return number;
  };

  // handle string parsing
  var string = function() {
    var hex, i, uffff;
    var string = '';

    if (cc === '"') {
      while (next()) {
        if (cc === '"') {
          next();
          return string;
        }
        if (cc === '\\') {
          next();
          if (cc === 'u') {
            uffff = 0;
            for (i = 0; i < 4; i += 1) {
              hex = parseInt(next(), 16);
              if (!isFinite(hex)) break;
              uffff = uffff * 16 + hex;
            }
            string += String.fromCharCode(uffff);
          } else if (typeof escapee[cc] === 'string') {
            string += escapee[cc];
          } else {
            break;
          }
        } else {
          string += cc;
        }
      }
    }
    throw new SyntaxError("Bad string");
  };

  // handle true, false, and null parsing
  var specialWord = function() {
    switch (cc) {
      case 't':
        next('t');
        next('r');
        next('u');
        next('e');
        return true;
      case 'f':
        next('f');
        next('a');
        next('l');
        next('s');
        next('e');
        return false;
      case 'n':
        next('n');
        next('u');
        next('l');
        next('l');
        return null;
    }
    throw new SyntaxError("Unexpected character");
  };

  // handle array parsing
  var array = function() {
    var array = [];

    if (cc === '[') {
      next('[');
      white();
      if (cc === ']') {
        next(']');
        return array;
      }
      while (cc) {
        array.push(value());
        white();
        if (cc === ']') {
          next(']');
          return array;
        }
        next(',');
        white();
      }
    }
    throw new SyntaxError("Bad array");
  };

  // handle object parsing
  var object = function() {
    var key;
    var object = {};

    if (cc === '{') {
      next('{');
      white();
      if (cc === '}') {
        next('}');
        return object;
      }
      while (cc) {
        key = string();
        white();
        next(':');
        if (Object.hasOwnProperty.call(object, key)) {
          throw new SyntaxError('Duplicate key "' + key + '"');
        }
        object[key] = value();
        white();
        if (cc === '}') {
          next('}');
          return object;
        }
        next(',');
        white();
      }
    }
    throw new SyntaxError("Bad object");
  };

  // handle other values
  var value = function() {
    white();
    switch (cc) {
      case '{':
        return object();
      case '[':
        return array();
      case '"':
        return string();
      case '-':
        return number();
      default:
        return cc >= '0' && cc <= '9' ? number() : specialWord();
    }
  };

  // return parsed or error
  return value();
};
  // your code goes here

