var $inplace = $inplace || {};
$inplace.utils = {};

(function($) {

  $inplace.utils.extend = function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  };

  $inplace.utils.Hash = function() { this.__hash = []; };
  $inplace.utils.extend($inplace.utils.Hash.prototype, {
    
    set: function(key, value) {
      var result = !this.__hash.every(function(item){
        if(item.key == key) {
          item.value = value;
          return false;
        }
        return true;
      });
      if(result) return;
      this.__hash.push({ 'key': key, 'value': value });
    },

    get: function(key) {
      var result = null;

      this.__hash.every(function(item){
        if(item.key == key) {
          result = item.value;
          return false;
        }
        return true;
      });

      return result;
    },

    has: function(key) {
      return this.__hash.some(function(item){ return item.key == key; });
    },
    
    remove: function(key) {
      this.__hash.removeIf(function(item) { return item.key == key; });
    },

    size: function() { return this.__hash.length; }
  });

  $inplace.utils.CloneRegistry = function() {
    this.__registry = [];
    this.register = function(key, value) {
      this.__registry.push({'key': key, 'value': value});
    };
    this.hasClone = function(key) {
      return this.getClone(key) != null;
    };
    this.getClone = function(key) {
      var result = null;
      this.__registry.forEach(function(desc) {
        if (desc.key == key) result = desc.value;
      });
      return result;
    };
  };


  if (!Array.prototype.without) {
    Array.prototype.without = function() {
      var values = $.makeArray(arguments);
      return this.removeIf(function(item){
        return values.some(function(value) { return value == item; } );
      }, this);
    }
  }

})(jQuery);