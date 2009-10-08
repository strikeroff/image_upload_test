$inplace.test = {};

(function($) {
  $inplace.test.StateStub = $inplace.Meta.clone("test.StateStub")
          .extend({
            __currentState: null,
            __message: "",
            should: function(state) {
              return this.shouldIn([state]);
            },
            shouldIn: function(range) {
              if( range.some(function(name) {return name === this.__currentState}, this) ) {
                console.log(this.__hint, "[PASS]", this.__message);
              }else{
                console.log(this.__hint, "[FAIL]", this.__message);
              }
              this.__message == "";
              return this;
            },
            name: function(message) { this.__message = message; return this; },
            set: function(state) { this.__currentState = state; return this; }
          });

  $inplace.test.StubSaveMonitor = $inplace.Group.clone("test.StubSaveMonitor");
  
  (function() {
    this.subscribeUpstream('save-changes', function(msg) {

      $.ajax({
        type: "FORK",
        url: "/",
        complete: function() {
          var success = Math.floor(100 * Math.random()) % 2 == 0;
          if(success) {
            msg.sender.sendMessage('save-successful');
          } else {
            msg.sender.sendMessage('save-failed');
          }
        }
      });

      throw $inplace.MessageTrapException;
    });
  }).apply($inplace.test.StubSaveMonitor);

  
})(jQuery);


