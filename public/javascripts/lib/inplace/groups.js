$inplace.groups = {};

(function($){

  $inplace.Group = $inplace.Node.clone("Group");

  $inplace.groups.DefaultSaveMonitor = $inplace.Group.clone("DefaultSaveMonitor");

})(jQuery);