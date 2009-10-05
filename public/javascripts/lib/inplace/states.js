(function($){
  $inplace.states = {};
  $inplace.states.Transition = function(event, target, handlers) {
    this.event = event;
    this.target = target;
    this.handlers = handlers;
  };

  $inplace.states.StateFinalizationException = { type: 'state-finalization-invalid' };

  /**
   * State - состояние. В UML данному объекту соответсвует определение вложенного состояния.
   */
  $inplace.State = $inplace.Node.clone("State")
    .extend({
      __transitions: $inplace.utils.clonableObject(new $inplace.utils.Hash()),
      _currentState: null,
      __handlers: {},
      __states: $inplace.utils.clonableObject(),
    
      hasState: function(stateName, behaviour, hint) {
        var behaviour = behaviour || $inplace.State;

        var state = this.__states[stateName];
        if(!state) {
          state = behaviour.clone(hint);
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

      hasHandler: function(hanlerName) {
        this.__makeHandlerMaker(hanlerName);
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

        //console.log("Setup state ", stateName, " for ", this.__hint);

        var _this = this;

        $.each(this.__transitions.get(this.__states[this._currentState]), function(event, direction) {
          $.each(direction.handlers, function(index, handler) {
            _this.subscribe(event, _this[handler]);
          });
          _this.subscribe(event, _this.__finishTransition);
        });

        this.disableChilds();
        this.__states[this._currentState].enable();

        //this.replaceChildsWith(this.__states[stateName]);
      },

      __resetHandlers: function() {
        // сносим хендлеры евентов
        if(!this._currentState || !this.__transitions.has(this.__states[this._currentState])) return;

        //console.log("Reset handlers for: ", this.__hint);

        var _this = this;
        $.each(this.__transitions.get(this.__states[this._currentState]), function(event, direction) {
          $.each(direction.handlers, function(index, handler) {
            _this.unsubscribe(event, _this[handler]);
          });
          _this.unsubscribe(event, _this.__finishTransition);
        });
      },

      __finishTransition: function(msg) {
        var targetState = this.__transitions.get(this.__states[this._currentState])[msg.topic].target;

        this.__resetHandlers();
        this.__setupState(targetState);
      },

      __makeHandlerMaker: function(handlerName) {
        
        this.__handlers[handlerName] = null;
        var _this = this;
        this[handlerName] = function(object) {
          if('function' == typeof(object)) {
            _this.__handlers[handlerName] = object;
          } else {
            if('function' == typeof(_this.__handlers[handlerName])) {
              _this.__handlers[handlerName].apply(_this, [object]);
            }
          }
          return _this;
        };

        return this;
      }
    });

  /**
   * Behaviour (поведение) - это состояние, которое может делегировать обработку своих событий
   * другому состоянию.
   * В UML определения нет.
   */
  $inplace.states.Behaviour = $inplace.State.clone("Behaviour")
    .extend({
      _delegateHandlersInto: function(target) {
        var source = this;
        $.each(this.__handlers, function(handlerName, handler){
          //if(!handler) return;

          target.__makeHandlerMaker(handlerName);
          if('function' == typeof(handler)) {
            target[handlerName](handler);
          }

          console.debug("delegating handler: ", handlerName);
          source[handlerName] = function(object) {
            console.debug('delegate handler call for ', handlerName);
            target[handlerName](object);
          };
        });
      }
    });

  /**
   * CompositeState - составное состояние, которое представляет из себя множество параллельно
   * функционирующих состояний. Стандартные методы, характерные для простого State'а перекрыты,
   * т.к. составное состояние не может описывать свои внутренние переходы. Эту задачу должны
   * выполнять регистрируемые в нем параллельные состояния.
   * В UML такой объект является обычным состоянием имеющим несколько параллельных вложенных состояний. 
   */
  $inplace.CompositeState = $inplace.states.Behaviour.clone("CompositeState")
    .extend({
      hasState: function(behaviour, hint) {
        if(!behaviour._delegateHandlersInto) return this;
        
        var instance = behaviour.clone(hint);
        this.appendChild(instance);
        instance._delegateHandlersInto(this);
        return this;
      },
      reset: function() {
        this.__childs.forEach(function(child){
          if(!child.reset) return;
          child.reset();
        });
        return this;
      },
      parentState: null, hasTransition: null, hasTransitions: null, setDefaultState: null
    });



})(jQuery);