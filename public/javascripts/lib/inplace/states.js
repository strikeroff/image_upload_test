(function($){
  $inplace.State = $inplace.Node.clone()
      .meta({
        hasState: function(stateName, behaviour) {
          var behaviour = behaviour || $inplace.State;
          this.__states = this.__states || {};
          var state = this.__states[stateName];
          if(!state) {
            state = behaviour.clone();
            this.appendChild(state); /// Aghtung!!! this is not a meta method!
            this.__states[stateName] = state;
          }
          return state;
        },
        
        parentState: function() {
          return this.parentNode();
        }
      });
  
})(jQuery);