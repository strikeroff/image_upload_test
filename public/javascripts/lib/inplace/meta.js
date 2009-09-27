Array.prototype.join = function(arr) {
  for(i=0; i<arr.length; i++) {
    this.push(arr[i]);
  }
  
  return this;
};

var $inplace = $inplace || {};

(function($) {
  $inplace.Meta = {
    clone: function() {
      return $.extend(true, {}, this);
    },

    extend: function(obj) {
      $.extend(this, obj);
      return this;
    }
  };
})(jQuery);

