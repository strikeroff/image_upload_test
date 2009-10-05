var $inplace = $inplace || {};
$inplace.utils = {};

(function($) {

  $inplace.utils.cloneFunction = function(hint, translations) {
    var result = {};
    var hint = hint || this.__hint;
    translations = translations || new $inplace.utils.Hash();
    translations.set(this, result);

    for (var name in this) {
      var object = this[name];

      if (object && typeof object === "object" && !object.nodeType) {
        if (translations.has(object)) {
          result[name] = translations.get(object);
          continue;
        }

        result[name] = object.clone ? object.clone(null, translations) : $.extend({}, object);
        //translations.register(object, result[name]);
      } else if (object !== undefined) {
        result[name] = object;
      }
    }

    //$.extend(true, {}, this);

    result.__hint = hint;
    return result;
  };

  $inplace.utils.clonableObject = function(object) {
    return $.extend(object || {}, {
      clone: $inplace.utils.cloneFunction
    })
  };

  if(!Array.prototype.clone) {
    Array.prototype.clone = function(hint, translations) {
      var result = [];
      translations = translations || new $inplace.utils.Hash();
      translations.set(this, result);
      this.forEach(function(item, index){
        if(item && typeof item === "object" && !item.nodeType && item.clone) {
          if(translations.has(item)) {
            result[index] = translations.get(item);
          } else {
            result[index] = item.clone(null, translations);
          }
        } else if (item !== undefined) {
          result[index] = item;
        }
      });
      return result;
    };
  }

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
      this.__hash.push($inplace.utils.clonableObject({ 'key': key, 'value': value }));
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
      var result = this.__hash.some(function(item){ return item.key == key; });
      //if(key && key.__hint) console.log("Lookup for: ", key.__hint, " was ", result? "successful": "unsuccessful");
      return result;
    },

    remove: function(key) {
      this.__hash.removeIf(function(item) { return item.key == key; });
    },

    size: function() { return this.__hash.length; }
  });

  $inplace.Meta = {
    clone: $inplace.utils.cloneFunction,
    extend: function(obj) {
      return $.extend(this, obj);
    }
  };
})(jQuery);

