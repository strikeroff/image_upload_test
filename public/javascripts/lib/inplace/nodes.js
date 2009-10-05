(function($) {
  $inplace.MessageTrapException = { type: 'message-trap' };
  
  $inplace.Message = function(topic, sender, data) {
    this.topic  = topic;
    this.sender = sender || null;
    this.data   = data || null;
  };

  $inplace.Node = $inplace.Meta.clone("Node")
    .extend({
      __childs: [],
      __downstreamHandlers: $inplace.utils.clonableObject(),
      __upstreamHandlers: $inplace.utils.clonableObject(),
      __enabled: true,

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
        var handlers = this.__downstreamHandlers[msg.topic];
        if(handlers) {
          var _this = this;
          $.each(handlers, function(index, handler) {
            if('function' == typeof(handler)) handler.apply(_this, [msg]);
          });
        }
      },
      
      childMessageHandler: function(msg){
        var handlers = this.__upstreamHandlers[msg.topic];
        if(handlers) {
          $.each(handlers, function(index, handler) {
            if('function' == typeof(handler)) handler(msg);
          });
        }
      },

      sendMessage: function(topic, data, sender) {
        var data = data || null;
        var sender = sender || this;
        this._processMessage(new $inplace.Message(topic, sender, data));
      },

      sendParentMessage: function(topic, data, sender){
        var data = data || null;
        var sender = sender || this;
        
        if(!this.parentNode) return this;
        this.parentNode._processChildMessage(new $inplace.Message(topic, sender, data));
        return this;
      },

      _processChildMessage: function(msg) {
        try {
          this.childMessageHandler(msg);
          if(!this.parentNode) return;
          this.parentNode._processChildMessage(msg);
        } catch (exc) {
          console.error('Exception while sending message to parent: '+exc.type);
          if(exc.type != 'message-trap') throw exc;
        }
      },
      
      _processMessage: function(msg) {
        if(!this.__enabled) return;
        //console.debug('Enter to processMessage: ', msg.topic, " for: ", this.__hint);
        try {
          this.messageHandler(msg);
          
          if(this.__childs) {
            this.__childs.forEach(function(child) {
              child._processMessage(msg);
            });
          }
        } catch (exc) {
          console.error("Exception while processing broadcast message: "+exc.type);
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
      },

      enable: function() {
        //console.log("Enabling: ", this.__hint);
        this.__enabled = true;
      },

      disable: function() {
        //console.log("Disabling: ", this.__hint);
        this.__enabled = false;
      },

      disableChilds: function() {
        if(!this.__childs) return;
        //console.log("Disabling childs for: ", this.__hint);
        this.__childs.forEach(function(child){ child.disable(); });
      },

      __printNodesTree: function(prefix) {
        var prefix = prefix || "";
        var postfix = this.__enabled ? " [Enabled]" : " [Disabled]";
        console.log(prefix, this.__hint, postfix, this);
        if(this.__childs) {
          this.__childs.forEach(function(child) {
            child.__printNodesTree(prefix+"| ");
          });
        }
      }
    });
    
  
})(jQuery);

