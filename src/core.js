require('./ext');
const isType = require('./isType');
const utils = require('./utils');
const {
    extend, has
} = utils;

const extendClass = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function() {
            return parent.apply(this, arguments);
        };
    }

    // Add static properties to the constructor function, if supplied.
    extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function() {
        this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

function Guppy(opt) {
    opt = extend(this.defaultOptions,opt);
    const self = this;
    var el;
    if (typeof opt === "undefined") return;
    var data = {};
    if (opt.default) {
        var def = opt.default;
        if (typeof def === "function") {
            data = def();
        }
    }
    this.set = function(key, value) {
        data[key] = value;
        this.trigger('change:' + key, this);
        return data;
    };
    this.get = function(key) {
        return data[key];
    };
    this.mount = function(_el){
        el = _el;
        this.trigger('mount', el);
        return this;
    };
    this.getElement = function(){
        return el;
    };
    function set(key) {
        return function() {
            self.set(key, opt[key].apply(self,arguments));
        };
    }

    function observe(key) {
        return function() {
            opt[key].apply(self,arguments);
        };
    }
    for (var key in opt) {
        var obj = opt[key];
        if (isType.isFunction(obj) && typeof obj.__guppy_properties__ === "object" && obj.__guppy_properties__.length > 0) {
            let src = obj.__guppy_properties__[0];
            if (typeof src === "string") {
                this.on("change:" + src, set(key));
            }
        }
        if (isType.isFunction(obj) && typeof obj.__guppy_observes__ === "object" && obj.__guppy_observes__.length > 0) {
            let src = obj.__guppy_observes__[0];
            if (typeof src === "string") {
                this.on("change:" + src, observe(key));
            }
        }
        if (isType.isFunction(obj) && typeof obj.__guppy_on__ === "object" && obj.__guppy_on__.length > 0) {
            let src = obj.__guppy_on__[0];
            if (typeof src === "string") {
                this.on(src, observe(key));
            }
        }
    }
    this.trigger('init', this);
    return this;
}
Guppy.defaultOptions = {};
Guppy.extend = extendClass;
Guppy.utils = utils;
Guppy.isType = isType;

var Events = require("./events");
extend(Guppy.prototype, Events);
module.exports = Guppy;
