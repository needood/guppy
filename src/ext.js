Function.prototype.$observes = function() {
    var ret = this;
    ret.__guppy_observes__ = arguments;
    return ret;
};
Function.prototype.$properties = function() {
    var ret = this;
    ret.__guppy_properties__ = arguments;
    return ret;
};
Function.prototype.$on = function() {
    var ret = this;
    ret.__guppy_on__ = arguments;
    return ret;
};
