(function($) {
  $inplace.MessageTrapException = { type: 'message-trap' };
  
  $inplace.Message = function(topic, sender, data) {
    this.topic  = topic;
    this.sender = sender;
    this.data   = data;
  };

  $inplace.Node = $inplace.Meta.clone()
    .extend({

      hasConstructor: function(options) {
        this.__childs = [];
        this.__downstreamHandlers = {};
        this.__upstreamHandlers = {};
      },

      appendChild: function(child) {
        this.__childs.push(child);
        child.parentNode = this;
        return this;
      },

      messageHandler: function(msg){ 
        var handlers = this.__downstreamHandlers[msg.topic];
        if(handlers) {
          $.each(handlers, function(handler) {
            handler(msg);
          });
        }
      },
      
      childMessageHandler: function(msg){
        var handlers = this.__upstreamHandlers[msg.topic];
        if(handlers) {
          $.each(handlers, function(handler) {
            handler(msg);
          });
        }
      },

      sendMessage: function(msg) {
        this._processMessage(msg);
      },

      sendParentMessage: function(msg){
        if(!this.parentNode) return this;
        this.parentNode._processChildMessage(msg);
        return this;
      },

      _processChildMessage: function(msg) {
        try {
          this.childMessageHandler(msg);
          if(!this.parentNode) return;
          this.parentNode._processChildMessage(msg);
        } catch (exc) {
          console.log('Exception while sending message to parent: '+exc.type);
          if(exc.type != 'message-trap') throw exc;
        }
      },
      
      _processMessage: function(msg) {
        try {
          this.messageHandler(msg);
          if(this.__childs) {
            $.each(this.__childs, function(child) {
              child._processMessage(msg);
            });
          }
        } catch (exc) {
          console.log("Exception while processing broadcast message: "+exc.type);
          if(exc.type != 'message-trap') throw exc;
        }
      },
      
      subscribe: function(topic, handler) {
        this.__downstreamHandlers[topic] = this.__downstreamHandlers[topic] || [];
        this.__downstreamHandlers[topic].push(handler);
        return this;
      },

      unsubscribe: function(topic, handler) {
        var handlers = this.__downstreamHandlers[topic];
        if(handlers) {
          handlers = handlers.without(handler);
        }
        return this;
      },
      
      subscribeUpstream: function(topic, handler) {
        this.__upstreamHandlers[topic] = this.__upstreamHandlers[topic] || [];
        this.__upstreamHandlers[topic].push(handler);
        return this;
      }
    });
    
  
})(jQuery);

