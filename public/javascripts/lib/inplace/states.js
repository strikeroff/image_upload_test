(function($){
  $inplace.states = {};
  $inplace.states.Transition = function(event, target, handlers) {
    this.event = event;
    this.target = target;
    this.handlers = handlers;
  };

  $inplace.states.StateFinalizationException = { type: 'state-finalization-invalid' };
  
  $inplace.State = $inplace.Node.clone()
    .extend({
      __transitions: new $inplace.utils.Hash(),
      _currentState: null,
      __handlers: {},
      hasState: function(stateName, behaviour) {
        var behaviour = behaviour || $inplace.State;
        this.__states = this.__states || {};
        
        var state = this.__states[stateName];
        if(!state) { // ?
          state = behaviour.clone();
          this.appendChild(state);
          this.__states[stateName] = state;
        }
        return state;
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
        this.__defaultState = stateName;
        return this;
      },

      reset: function() {
        // Сбрасываем состояние в начальное

        this.__resetHandlers();
        this.__setupState(this.__defaultState);
        return this;
      },

      __makeHandlerMakers: function(handlers) {
        $.makeArray(handlers).forEach(function(handler) {
          this.__makeHandlerMaker(handler);
        }, this);
        return $.makeArray(handlers) || [];
      },
      
      _hasTransition: function(from, description) {
        var trans = this.__transitions.get(from);
        if(!trans) { // ?
          trans = {};
          this.__transitions.set(from, trans);
        }
        
        var direction = trans[description.event];
        if(!direction) { // ?
          trans[description.event] = direction = { target: description.target, handlers: this.__makeHandlerMakers(description.handlers)};
        } else {
          direction.target = description.target;
          $.merge(direction.handlers, this.__makeHandlerMakers(description.handlers));
        }
      },

      __setupState: function(stateName) {
        this._currentState = stateName;
        if(!this.__transitions.has(this.__states[this._currentState])) return;

        var _this = this;
        
        $.each(this.__transitions.get(this.__states[this._currentState]), function(event, direction) {
          $.each(direction.handlers, function(index, handler) {
            _this.subscribe(event, _this[handler]);
          });
          _this.subscribe(event, this.__finishTransition);
        });

        //this.replaceChildsWith(this.__states[stateName]);
      },

      __finishTransition: function(msg) {
        var targetState = this.__transitions.get(this.__states[this._currentState])[msg.topic];
        this.__resetHandlers();
        this.__setupState(targetState);
      },

      __resetHandlers: function() {
        // сносим хендлеры евентов
        if(!this._currentState || !this.__transitions.has(this.__states[this._currentState])) return;

        var _this = this;
        $.each(this.__transitions.get(this.__states[this._currentState]), function(event, direction) {
          $.each(direction.handlers, function(index, handler) {
            _this.unsubscribe(event, this[handler]);
          });
          _this.unsubscribe(event, this.__finishTransition);
        });
      },
      
      __makeHandlerMaker: function(handlerName) {
        console.log("handler name: ", handlerName);
        this.__handlers = this.__handlers || {};

        this[handlerName] = function(object) {
          if('function' == typeof(object)) {
            this.__handlers[handlerName] = object;
          } else {
            this.__handlers[handlerName].apply(this, object);
          }
          return this;
        };
        
        return this;
      }
    });
  
})(jQuery);