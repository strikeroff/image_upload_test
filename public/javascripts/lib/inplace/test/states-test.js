
(function($) {

  var testStateStub = $inplace.test.StateStub.clone("Simple Transitions Test");
  
  $inplace.test.TestState = $inplace.State.clone("test.TestState")
          .hasState('view')
              .hasTransition({event: 'switch-on', target: 'edit', handlers: 'onStartEdit'})
              .parentState()
          .hasState('edit')
              .hasTransition({event: 'save', target: 'edit', handlers: 'onSave'})
              .hasTransition({event: 'switch-off', target: 'view', handlers: 'onStopEdit'})
              .parentState()
          .setDefaultState('view')
          .onStartEdit(function(msg) {
            testStateStub.set("onStartEdit");
          })
          .onStopEdit(function(msg) {
            testStateStub.set('onStopEdit');
          })
          .onSave(function(msg) {
            testStateStub.set('onSaveEdit');
          });

  var testState = $inplace.test.TestState.clone("testState");
  testState.reset();

  testState.sendMessage('switch-on');
  testStateStub.name('First switch-on event').should("onStartEdit");


  testState.sendMessage('switch-on');
  testStateStub.name('Second switch-on event').should("onStartEdit");


  testState.sendMessage('save');
  testStateStub.name('First save event').should("onSaveEdit");


  testState.sendMessage('switch-off');
  testStateStub.name('First switch-off event').should("onStopEdit");




  var baseBehaviourStub = $inplace.test.StateStub.clone("Composite:BaseBehaviour");
  var addBehaviourStub = $inplace.test.StateStub.clone("Composite:AdditionalBehaviour");

  $inplace.test.BaseBehaviour = $inplace.states.Behaviour.clone("test.BaseBehaviour")
          .hasState('inactive', null, "inactive state")
            .hasTransition({event: 'activate', target: 'active', handlers: 'onActivate'})
            .parentState()
          .hasState('active', null, "active state")
            .hasTransition({event: 'deactivate', target: 'inactive', handlers: 'onDeactivate'})
            .parentState()
          .setDefaultState('inactive')
          .reset()

          .onActivate(function() {
            baseBehaviourStub.set("oldOnActivate");
          });

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
            addBehaviourStub.set("onShow");
          })
          .onHide(function(){
            addBehaviourStub.set('onHide')
          })
          .onActivate(function(){
            baseBehaviourStub.set('onActivate')
          })
          .onAdditionalActivate(function(){
            addBehaviourStub.set('onAdditionalActivate')
          })
          .onDeactivate(function(){
            baseBehaviourStub.set('onDeactivate')
          });

  var cState = $inplace.test.CompositeState.clone("test.cState");

  cState.sendMessage('activate');
  baseBehaviourStub.name('activate').should('onActivate');
  addBehaviourStub.name('activate').should('onAdditionalActivate');


  cState.sendMessage('show');
  addBehaviourStub.name('show').should('onShow');


  cState.sendMessage('hide');
  addBehaviourStub.name('hide').should('onHide');


  cState.sendMessage('activate');
  addBehaviourStub.name('second activate').should('onAdditionalActivate');


  cState.sendMessage('deactivate');
  baseBehaviourStub.name('deactivate').should("onDeactivate");





  var componentStateStub = $inplace.test.StateStub.clone("Component testing");

  $inplace.test.TestModel = $inplace.Model.clone("test.TestModel").makeNewer()
          .extend({ value: 0 });

  $inplace.test.TestComponent = $inplace.Component.clone("test.TestComponent")
          .__initializeModel(function() {
            this.object =  $inplace.test.TestModel.clone();
          });

  var testComponent = $inplace.test.TestComponent.clone("testComponent")
          .onActivateComponent(function() {
            componentStateStub.set("onActivateComponent");
          })
          .onDeactivateComponent(function() {
            this.object.value = 20;
            this.sendMessage('save');
          })
          .onSaveSuccess(function() {
            componentStateStub.set(this.object.value);
          })
          .onSaveFail(function() {
            componentStateStub.set(this.object.value);
          })
          .installComponent(null);

  var monitor = $inplace.test.StubSaveMonitor.clone("testSaveMonitor")
          .appendChild(testComponent);

  testComponent.object.value = 666;

  monitor.sendMessage('switch-on');
  monitor.sendMessage('switch-off');

  componentStateStub.name("Before saving").should("onActivateComponent");

  $inplace.test.timeoutHandler = function() {
    componentStateStub.name("After saving").shouldIn([20, 666]);
    clearTimeout($inplace.test.timeouter);
  }

  $inplace.test.timeouter = setTimeout("$inplace.test.timeoutHandler()", 300);

})(jQuery);