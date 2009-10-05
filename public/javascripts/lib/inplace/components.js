$inplace.components = {};

(function($){
  $inplace.components.StandardSaveBehaviour = $inplace.states.Behaviour.clone("StandardSaveBehaviour")
          .hasState('passive')
            .hasTransition({event: 'save', target: 'saving', handlers: ['__trySaveChanges', 'onSave']})
            .parentState()
          .hasState('saving')
            .hasTransition({event: 'save-successful', target: 'passive', handlers: ['__commitChanges',   'onSaveSuccess']})
            .hasTransition({event: 'save-failed',     target: 'passive', handlers: ['__rollbackChanges', 'onSaveFail']})
            .parentState()
          .setDefaultState('passive')
          .reset()

          .__trySaveChanges(function() {
            this.sendParentMessage('save-changes');
          });
  
  $inplace.components.BaseBehaviour = $inplace.states.Behaviour.clone("BaseBehaviour")
          .hasState('inactive')
            .hasTransition({ event: 'switch-on', target: 'active', handlers: ['__initializeComponent', 'onActivateComponent'] })
            .parentState()
          .hasState('active')
            .hasTransition({ event: 'switch-off', target: 'inactive', handlers: 'onDeactivateComponent' })
            .parentState()
          .setDefaultState('inactive')
          .reset();

  $inplace.Component = $inplace.CompositeState.clone("Component")
          .extend({
            /**
             * Инициализация компонента
             * @param dom DOM-элемент, в котором содержится текущее состояние модели
             */
            installComponent: function(dom) {
              // инициализация компонента
              this.__dom = dom;
              this.__initializeModel();
              return this;
            },
            dom: function() { return this.__dom; }
          })
          .hasHandler('__initializeModel') // вызывается, когда надо проинициализировать модель
          .hasState($inplace.components.BaseBehaviour)
          .hasState($inplace.components.StandardSaveBehaviour);


})(jQuery);