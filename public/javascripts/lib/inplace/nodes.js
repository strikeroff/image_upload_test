(function($) {
  $inplace.MessageTrapException = { type: 'message-trap' };
  
  $inplace.Message = function(topic, sender, data) {
    this.topic  = topic;
    this.sender = sender || null;
    this.data   = data || null;
  };

  $inplace.Node = $inplace.Meta.clone()
    .extend({
      __childs: [],
      __downstreamHandlers: [],
      __upstreamHandlers: [],

      appendChild: function(child) {
        this.__childs.push(child);
        child.parentNode = this;
        return this;
      },

      removeChild: function(child) {
        if(child.parentNode != this) return;
        child.parentNode = null;
        this.__childs.without(child);
        return this;
      },

      removeChilds: function() {
        this.__childs.forEach(function(child) {
          this.removeChild(child);
        }, this);
        
        return this;
      },

      replaceChildsWith: function(newChilds) {
        this.removeChilds();
        $.makeArray(newChilds).forEach(function(child) {
          this.appendChild(child);
        }, this);
        
        return this;
      },

      messageHandler: function(msg){
        //console.log('enter to message handler');
        var handlers = this.__downstreamHandlers[msg.topic];
        if(handlers) {
          $.each(handlers, function(handler) {
            handler(msg);
          });
        }
        //console.log('leave message handler');
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
        //console.log('Enter to processMessage');
        try {
          this.messageHandler(msg);
          if(this.__childs) {
            this.__childs.forEach(function(child) {
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
      },

      unsubscribeUpstream: function(topic, handler) {
        var handlers = this.__upstreamHandlers[topic];
        if(handlers) {
          handlers = handlers.without(handler);
        }
        return this;
      }
    });
    
  
})(jQuery);

