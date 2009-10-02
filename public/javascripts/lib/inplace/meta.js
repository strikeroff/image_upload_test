(function($) {

  $inplace.utils.cloneFunction = function(translations) {
    var result = {};
    translations = translations || new $inplace.utils.CloneRegistry();
    translations.register(this, result);

    for (var name in this) {
      var object = this[name];

      if (translations.hasClone(object)) {
        result[name] = translations.getClone(object);
        continue;
      }

      if (object && typeof object === "object" && !object.nodeType) {
        result[name] = object.clone ? object.clone(translations) : $.extend({}, object);
        //translations.register(object, result[name]);
      } else if (object !== undefined) {
        result[name] = object;
      }
    }

    //$.extend(true, {}, this);
    return result;
  };

  if(!Array.prototype.clone) {
    Array.prototype.clone = function(translations) {
      var result = [];
      translations = translations || new $inplace.utils.CloneRegistry();
      translations.register(this, result);
      this.forEach(function(item, index){
        if(translations.hasClone(item)) {
          result[index] = translations.getClone(item);
        } else {
          if(item && typeof item === "object" && !item.nodeType) {
            result[index] = item.clone(translations);
            //translations.register(item, result[index]);
          } else if (item !== undefined) {
            result[index] = item;
          }
        }
      });
      return result;
    };
  }

  //if(!Object.prototype.clone) {
  //  console.log('1');
  //  Object.prototype.clone = $inplace.utils.cloneFunction;
  //  console.log('2');
  //}

  $inplace.Meta = {
    clone: $inplace.utils.cloneFunction,
    extend: function(obj) {
      return $.extend(this, obj);
    }
  };
})(jQuery);

