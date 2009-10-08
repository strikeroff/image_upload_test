$inplace.components = {};

(function($){

  $inplace.Model = $inplace.Meta.clone("Model")
          .extend({
            __backups: [],
            $$cloneExceptations: ["__hint", "__backups", "backup", "rollback", "commit", "clone", "extend", "makeNewer"],
            backup: function() {
              this.__backups.push(this.clone());
              return this;
            },
            rollback: function() {
              var backup = this.__backups.pop();
              if(backup != undefined) {
                this.extend(backup);
              }
              return this;
            },
            commit: function() {
              this.__backups = [];
              return this;
            }
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

  $inplace.components.StandardSaveBehaviour = $inplace.states.Behaviour.clone("StandardSaveBehaviour")
          .hasState('passive')
            .hasTransition({event: 'save', target: 'saving', handlers: ['__trySaveChanges', 'onSave']})
            .hasTransition({event: 'switch-on', target: 'passive', handlers: ['__backupModel']})
            .parentState()
          .hasState('saving')
            .hasTransition({event: 'save-successful', target: 'passive', handlers: ['__commitChanges',   'onSaveSuccess']})
            .hasTransition({event: 'save-failed',     target: 'passive', handlers: ['__rollbackModel', 'onSaveFail']})
            .parentState()
          .setDefaultState('passive')
          .reset()

          .__trySaveChanges(function() {
            this.sendParentMessage('save-changes');
          })

          .__backupModel(function() {
            if(this.object) this.object.backup();
          })

          .__rollbackModel(function() {
            if(this.object) this.object.rollback();
          })

          .__commitChanges(function() {
            if(this.object) this.object.commit();
          });

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