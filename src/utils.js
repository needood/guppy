const isType = require('./isType.js');
const rspace = /\s+/;
const nativeKeys = Object.keys;


const domOpt = {
    create: function(str) {
        var _dom = document.createElement('div');
        _dom.innerHTML = str;
        return _dom.removeChild(_dom.children[0]);
    },
    addClass: function(elem, name) {
        return mapcall(elem, function(elem) {
            if (elem.className === '') {
                elem.className = name;
            } else {
                var ori = elem.className,
                    nclass = [];

                mapcall(name.split(rspace), function(item) {
                    if (!new RegExp('\\b(' + item + ')\\b').test(ori)) {
                        nclass.push(' ' + item);
                    }
                });
                elem.className += nclass.join('');
            }
            return elem;
        });
    },
    setClass: function(elem, name) {
        return mapcall(elem, function(elem) {
            elem.className = name;
            return elem;
        });
    },
    hasClass: function(elem, name) {
        return new RegExp('\\b(' + name.split(rspace).join('|') + ')\\b').test(elem.className);
    },
    removeClass: function(elem, name) {
        return mapcall(elem, function(elem) {
            elem.className = name ? stringOpt.trim(
                elem.className.replace(
                    new RegExp('\\b(' + name.split(rspace).join('|') + ')\\b', 'g'), '')
                .split(rspace)
                .join(' ')
            ) : '';

            return elem;
        });
    }
};
const funcOpt = {
    before: function(times, func) {
        var memo;
        return function() {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
        };
    },
    once: function(func) {
        return funcOpt.before.call(this, 2, func);
    }
};


const isEmpty = function(obj) {
    if (obj == null) return true;
    if (isType.isArrayLike(obj) && (isType.isArray(obj) || isType.isString(obj) || isType.isArguments(obj))) return obj.length === 0;
    return keys(obj).length === 0;
};

var idCounter = 0;
const uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};
const has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
};

const allKeys = function(obj) {
    if (window._) {
        return _.allKey;
    }
    if (!isType.isObject(obj)) {
        return [];
    }
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys;
};

const keys = function(obj) {
    if (window._) {
        return _.keys;
    }
    if (!isType.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
};
const createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
        var length = arguments.length;
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
                var key = keys[i];
                if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
            }
        }
        return obj;
    };
};
const extend = createAssigner(allKeys);

const mapcall = function(match, callback) {
    if (match === null) {
        return;
    }

    if (callback === undefined) {
        return match;
    }
    if (isType.isArray(match)) {
        for (var i=0;i<match.length;i++) {
            callback(match[i]);
        }
    } else {
        return callback(match);
    }
};

const stringOpt = {
    camelCase: function(string) {
        return string.replace('-ms-', 'ms-').replace(rcamelCase, function(match, letter) {
            return (letter + '').toUpperCase();
        });
    },
    replace: function(string, replacements) {
        for (var key in replacements) {
            string = string.replace(new RegExp(key, 'ig'), replacements[key]);
        }

        return string;
    },
    slashes: function(string) {
        return $string.replace(string, {
            "\\\\": '\\\\',
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\r": '\\r',
            '"': '\\"'
        });
    },
    trim: "".trim ?
        function(string) {
            return string.trim();
        } : function(string) {
            return (string + '').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }
};

module.exports = {
    stringOpt, uniqueId, has, allKeys, extend, keys, funcOpt, isEmpty, mapcall, domOpt
};
