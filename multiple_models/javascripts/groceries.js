var templates = {};

$('[type="text/x-handlebars"]').each(function() {
  var $template = $(this);
  templates[$template.attr('id')] = Handlebars.compile($template.html());
});

Handlebars.registerPartial('item', $('#item').html());

var App = {
  collection: [],

  sortItems: function() {
    this.collection = _(this.collection).sortBy('name');
  },

  render: function() {
    this.sortItems();
    $('tbody').html(templates.items({ items: this.collection }));
  },

  add: function(item_data) {
    item_data.id = this.collection.length + 1;
    var item = new this.ItemModel(item_data);
    this.collection.push();
    return item;
  },

  remove: function(idx) {
    var item = _(this.collection).findWhere({ id: idx })
    this.collection = _(this.collection).without(item);
  },

  reset: function() {
    this.collection = [];
  },

  addItem: function(e) {
    e.preventDefault();
    var $f = $(e.target),
        name = $f.find('[name="name"]').val(),
        quantity = $f.find('[name="quantity"]').val();

    this.add({ name: name, quantity: quantity });
    this.render();
  },

  deleteAll: function(e) {
    e.preventDefault();
    this.reset();
    this.render();
  },

  deleteItem: function(e) {
    e.preventDefault();
    var $a = $(e.target),
        idx = +$a.attr('data-id');

    this.remove(idx);
    this.render();
  },

  bind: function() {
    $('table + p a').on('click', this.deleteAll.bind(this));
    $('tbody').on('click', 'tr a', this.deleteItem.bind(this));
    $('form').on('submit', this.addItem.bind(this));
  },

  init: function() {
    items_json.forEach(this.add.bind(this));
    this.bind();
    this.render();
  }
};

App.ItemModel = Backbone.Model.extend({
  idAttribute: 'id'
});

App.init();
