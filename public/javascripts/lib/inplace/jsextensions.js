Function.prototype.emptyFunction = function(){};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }
        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
};
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(elt /*, from*/) {
        var len = this.length;
        var from = Number(arguments[1]);
        if (isNaN(from)) {
            from = len - 1;
        } else {
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            } else if (from >= len) {
                from = len - 1;
            }
        }
        for (; from > -1; from--) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
};
if (!Array.prototype.every) {
    Array.prototype.every = function(/*function (item, index, collection)*/fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this && !fun.call(thisp, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
};
if (!Array.prototype.filter) {
    Array.prototype.filter = function(/*function (item, index, collection)*/fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i];
                // in case fun mutates this
                if (fun.call(thisp, val, i, this)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
};
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(/*function (item, index, collection)*/fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                fun.call(thisp, this[i], i, this);
            }
        }
    };
};
if (!Array.prototype.map) {
    Array.prototype.map = function(/*function (item, index, collection)*/fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(thisp, this[i], i, this);
            }
        }
        return res;
    };
};
if (!Array.prototype.some) {
    Array.prototype.some = function(/*function (item, index, collection)*/fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this && fun.call(thisp, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
};
if (!Array.prototype.removeIf) {
    Array.prototype.removeIf = function(/*function (item, index, collection)*/fun /*, thisp*/) {
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var thisp = arguments[1];
        for (var i in this) {
            if (this[i] !== this.constructor.prototype[i]) {
                if (fun.call(thisp, this[i], i, this)) {
                    this.splice(i, 1);
                }
            }
        }
        return this;
    };
};
if (!Array.prototype.indexOfUsing) {
    Array.prototype.indexOfUsing = function(/*function (item, index, collection)*/fun /*, thisp*/) {
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var thisp = arguments[1];
        for (var i in this) {
            if (this[i] !== this.constructor.prototype[i]) {
                if (fun.call(thisp, this[i], i, this)) {
                    return i;
                }
            }
        }
        return -1;
    };
};

String.prototype.startsWith = function (prefix) {
    return this.toLowerCase().indexOf(prefix.toLowerCase()) == 0;
};
String.prototype.endsWith = function (suffix) {
    return this.toLowerCase().lastIndexOf(suffix.toLowerCase()) == (this.length - suffix.length);
};
String.prototype.filterPrefix = function (prefix) {
    if (this.startsWith(prefix)) {
        return this.substr(prefix.length).toString();
    }
    return this.toString();
};

if (!window.console) {
    var con = window.console = {};
    ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"].forEach(function (name) {
        con[name] = Function.emptyFunction;
    });
};

(function($){
  if (!Array.prototype.without) {
    Array.prototype.without = function() {
      var values = $.makeArray(arguments);
      return this.removeIf(function(item){
        return values.some(function(value) { return value == item; } );
      }, this);
    }
  }
})(jQuery);

