var $inplace = $inplace || {};

(function($) {
  $inplace.Message = $inplace.Meta.clone();
  $inplace.MessageTrapException = { type: 'message-trap' };
  
  $inplace.Node = $inplace.Meta.clone()
          .hasMethod('_processMessage')
          .hasMethod('messageHandler')
          .messageHandler(function(msg){ })
          ._processMessage(function(msg) {
            try {
              this.messageHandler(msg);
            } catch (exc) {
              
            }
          });
    
  
})(jQuery);

