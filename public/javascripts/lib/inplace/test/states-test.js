$inplace.test = {};

var testState = null;

(function($) {
  //$inplace.test.TestState = $inplace.State.clone()
  //        .hasState('view')
  //            .hasTransition({event: 'switch-on', target: 'edit', handlers: 'onStartEdit'})
  //            .parentState()
  //        .hasState('edit')
  //            .hasTransition({event: 'save', target: 'edit', handlers: 'onSave'})
  //            .hasTransition({event: 'switch-off', target: 'view', handlers: 'onStopEdit'})
  //            .parentState()
  //        .setDefaultState('view')
  //        .onStartEdit(function(msg) {
  //          console.log('onStartEdit');
  //        })
  //        .onStopEdit(function(msg) {
  //          console.log('onStopEdit');
  //        })
  //        .onSave(function(msg) {
  //          console.log('onSaveEdit');
  //        });
  //
  //console.log('making clone');
  //testState = $inplace.test.TestState.clone();
  //testState.reset();
  //console.log('First   switch-on event');
  //testState.sendMessage('switch-on');
  //
  //console.log('Second  switch-on event');
  //testState.sendMessage('switch-on');
  //
  //console.log('First save event');
  //testState.sendMessage('save');
  //
  //console.log('First   switch-off event');
  //testState.sendMessage('switch-off');



  $inplace.test.BaseBehaviour = $inplace.states.Behaviour.clone("test.BaseBehaviour")
          .hasState('inactive', null, "inactive state")
            .hasTransition({event: 'activate', target: 'active', handlers: 'onActivate'})
            .parentState()
          .hasState('active', null, "active state")
            .hasTransition({event: 'deactivate', target: 'inactive', handlers: 'onDeactivate'})
            .parentState()
          .setDefaultState('inactive')
          .reset();

  $inplace.test.AdditionalBehaviour = $inplace.states.Behaviour.clone("test.AdditionalBehaviour")
          .hasState('hidden', null, "hidden state")
            .hasTransition({event: 'show', target: 'visible', handlers: 'onShow'})
            .hasTransition({event: 'activate', target: 'hidden', handlers: 'onAdditionalActivate'})
            .parentState()
          .hasState('visible', null, "visible state")
            .hasTransition({event: 'hide', target: 'hidden', handlers: 'onHide'})
            .parentState()
          .setDefaultState('hidden')
          .reset();

  $inplace.test.CompositeState = $inplace.CompositeState.clone("test.CompositeState")
          .hasState($inplace.test.BaseBehaviour, "test.BaseBehaviour instance")
          .hasState($inplace.test.AdditionalBehaviour, "test.AdditionalBehaviour instance")
          .onShow(function(){
            console.log('onShow')
          })
          .onHide(function(){
            console.log('onHide')
          })
          .onActivate(function(){
            console.log('onActivate')
          })
          .onAdditionalActivate(function(){
            console.log('onAdditionalActivate')
          })
          .onDeactivate(function(){
            console.log('onDeactivate')
          });

  var cState = $inplace.test.CompositeState.clone("test.cState");
  console.log('activate');
  cState.sendMessage('activate');  
  console.log('show');
  cState.sendMessage('show');
  console.log('hide');
  cState.sendMessage('hide');
  console.log('activate');
  cState.sendMessage('activate');
  console.log('deactivate');
  cState.sendMessage('deactivate');

  cState.__printNodesTree();

})(jQuery);