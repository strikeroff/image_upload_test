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

