$inplace.test = {};

var testState = null;

(function($) {
  $inplace.test.TestState = $inplace.State.clone()
          .hasState('view')
              .hasTransition({event: 'switch-on', target: 'edit', handlers: 'onStartEdit'})
              .parentState()
          .hasState('edit')
              .hasTransition({event: 'save', target: 'edit', handlers: 'onSave'})
              .hasTransition({event: 'switch-off', target: 'view', handlers: 'onStopEdit'})
              .parentState()
          .setDefaultState('view')
          .onStartEdit(function(msg) {
            console.log('onStartEdit');
          })
          .onStopEdit(function(msg) {
            console.log('onStopEdit');
          })
          .onSave(function(msg) {
            console.log('onSaveEdit');
          });

  console.log('making clone');
  testState = $inplace.test.TestState.clone();
  testState.reset();
  console.log('First   switch-on event');
  testState.sendMessage(new $inplace.Message('switch-on'));

  console.log('Second  switch-on event');
  testState.sendMessage(new $inplace.Message('switch-on'));

  console.log('First save event');
  testState.sendMessage(new $inplace.Message('save'));

  console.log('First   switch-off event');
  testState.sendMessage(new $inplace.Message('switch-off'));
})(jQuery);