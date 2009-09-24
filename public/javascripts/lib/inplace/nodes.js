var $inplace = $inplace || {};

(function($) {
  $inplace.MessageTrapException = { type: 'message-trap' };
  
  $inplace.Message = $inplace.Meta.clone()
          .hasConstructor(function(options) {
            this.topic  = options.topic;
            this.sender = options.sender;
            this.data   = options.data;
          })
          .meta({
            newMessage: function(topic, sender, data) {
              return this.create({ topic: topic, sender: sender, data: data });
            }
          });

  $inplace.Node = $inplace.Meta.clone()
          .hasMethod('appendChild')

          .hasMethod('_processMessage')
          .hasMethod('_processChildMessage')
          .hasMethod('childMessageHandler')
          .hasMethod('messageHandler')
          
          .hasMethod('sendMessage')
          .hasMethod('sendParentMessage')

          .hasConstructor(function(options) {
            this.__childs = [];
          })

          .appendChild(function(child) {
            this.__childs.push(child);
            child.parentNode = this;
            return this;
          })

          .messageHandler(function(msg){ })
          .childMessageHandler(function(msg){ })

          .sendMessage(function(msg) {
            this._processMessage(msg);
          })

          .sendParentMessage(function(msg){
            if(!this.parentNode) return this;
            this.parentNode._processChildMessage(msg);
            return this;
          })

          ._processChildMessage(function(msg) {
            try {
              this.childMessageHandler(msg);
              if(!this.parentNode) return;
              this.parentNode._processChildMessage(msg);
            } catch (exc) {
              console.log('Exception while sending message to parent: '+exc.type);
            }
          })
          
          ._processMessage(function(msg) {
            try {
              this.messageHandler(msg);
              if(this.__childs) {
                $.each(this.__childs, function(child) {
                  child._processMessage(msg);
                });
              }
            } catch (exc) {
              console.log("Exception while processing broadcast message: "+exc.type);
            }
          });
    
  
})(jQuery);

