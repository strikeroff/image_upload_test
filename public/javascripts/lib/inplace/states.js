(function($){
  $inplace.states = {};
  $inplace.states.Transition = function(event, target, handlers) {
    this.event = event;
    this.target = target;
    this.handlers = handlers;
  };
  
  $inplace.State = $inplace.Node.clone()
    .extend({
      hasState: function(stateName, behaviour) {
        var behaviour = behaviour || $inplace.State;
        this.__states = this.__states || {};
        //this.__pstates = this.__pstates || {};
        
        var state = this.__states[stateName];
        if(!state) { // ?
          state = behaviour.clone();
          this.appendChild(state);
          this.__states[stateName] = state;
          //this.__pstates[state] = stateName;
        }
        return state;
      },
      
      _hasTransition: function(from, description) {
        this.__transitions = this.__transitions || {};
        var trans = this.__transitions[from];
        if(!trans) { // ?
          this.__transitions[from] = trans = {};
        }
        
        // continue here
      },
      
      hasTransition: function(transitionDescription) {
        this.parentState()._hasTransition(this, transitionDescription);
        return this;
      },
      
      hasTransitions: function(descriptions) {
        var _this = this;
        $.each(descriptions, function(description) {
          _this.hasTransition(description);
        });
        
        return this;
      },
      
      parentState: function() {
        return this.parentNode;
      },
      
      setDefaultState: function(stateName) {
        this.defaultState = stateName;
        return this;
      },
      
      makeHandlerMaker: function(handlerName) {
        this.__handlers = this.__handlers || {};
        this[handlerName] = function(handler) {
          if(handler) {
            this.__handlers[handlerName] = handler;
          } else {
            this.__handlers[handlerName].apply(this);
          }
          return this;
        };
        return this;
      }
    });
  
})(jQuery);