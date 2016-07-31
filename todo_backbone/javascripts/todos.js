var App = {
  $el: $('main'),
  $todos: $('#todos'),

  newTodo: function(e) {
    e.preventDefault();
    var name = $(e.target).find('[name="todo_name"]').val(),
        model, view;

    if (!name) { return; }

    model = this.Todos.add({
      name: name
    });
    view = new this.TodoView( {model: model} );
    this.$todos.append(view.$el);

    e.target.reset();
  },

  clearComplete: function(e) {
    e.preventDefault();
    var incomplete = this.Todos.where({ complete: false });
    this.Todos.set(incomplete);
  },

  bind: function() {
    this.$el.find('form').on('submit', this.newTodo.bind(this));
    this.$el.find('#clear').on('click', this.clearComplete.bind(this));
  },

  init: function() {
    this.bind();
  }
}

var templates = {};

$('[type="text/x-handlebars"]').each(function() {
  $t = $(this);
  templates[$t.attr('id')] = Handlebars.compile($t.html());
});

(function() {
  var id = 1;

  var todo_model = Backbone.Model.extend({
    idAttribute: 'id',
    defaults: {
      complete: false
    },

    initialize: function() {
      this.set('id', id);
      id++;
    }
  });

  App.Todo = todo_model;
})();

App.Todos = new Backbone.Collection([], {
  model: App.Todo
});

App.TodoView = Backbone.View.extend({
  tagName: 'li',
  template: templates.todo,
  events: {
    'click a.toggle': 'toggleComplete',
    'click': 'editTodo',
  },

  render: function() {
    this.$el.attr('data-id', this.model.get('id'));
    this.$el.html(this.template(this.model.toJSON()));
  },

  editTodo: function(e) {
    e.preventDefault();
    var idx = +$(e.target).attr('data-id'),
        model = App.Todos.get(idx),
        $edit_form = $(templates.todo_edit(model.toJSON()));

    this.$el.after($edit_form);
    this.$el.remove();

    $edit_form.find('input').focus();
    $edit_form.on('blur', 'input', this.hideEdit.bind(this));
  },

  toggleComplete: function(e) {
    var $li = $(e.target).closest('li'),
        idx = +$li.attr('data-id'),
        model = App.Todos.get(idx);
    model.set('complete', !model.get('complete'));
    $li.toggleClass('complete', model.get('complete'));
    return false;
  },
 
  hideEdit: function(e) {
    var $input = $(e.target),
        $li = $input.closest('li'),
        name = $input.val();

    this.model.set('name', name);
    $li.after(this.$el);
    $li.remove();
    $input.off(e);
    this.delegateEvents();
  },

  initialize: function() {
    this.render();
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'remove', this.remove);
  }
});

App.init();
