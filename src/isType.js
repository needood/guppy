const ObjProto = Object.prototype;
const nativeIsArray = Array.isArray;
const toString = ObjProto.toString;
var property = function(key) {
    return function(obj) {
        return obj == null ? void 0 : obj[key];
    };
};

// Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object
// Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = property('length');
var isType = {
    isArrayLike: function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    },
    isArray: nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    },
    isFunction: function(obj) {
        return typeof obj === 'function';
    },
    isObject: function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }
};
// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
var baseTypeArr = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'];
for (var i = 0; i < baseTypeArr.length; i++) {
    (function(name) {
        isType['is' + name] = function(obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    })(baseTypeArr[i]);
}

if (!isType.isArguments(arguments)) {
    isType.isArguments = function(obj) {
        return obj.hasOwnProperty('callee');
    };
}
module.exports = isType;
