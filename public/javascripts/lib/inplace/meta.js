var $inplace = $inplace || {};

(function($) {
  $inplace.Meta = {
    __template: function(options) {
      this.options = options;
    },

    create: function(options) {
      return new this.__template(options);
    },

    clone: function() {
      return $.extend(true, {}, this);
    },

    hasMethod: function(name, handler) {
      var proto = this.__template.prototype;
      this[name] = function(methodHandler) {
        if("function" != typeof(methodHandler)) return this;
        proto[name] = methodHandler;
      };

      // @handler argument is optional
      this[name](handler);

      return this;
    },
    
    meta: function(obj) {
      $.extend(this.prototype, obj);
      return this;
    },

    extend: function(obj) {
      $.extend(this.__template.prototype, obj);
      return this;
    }
  };
})(jQuery);

