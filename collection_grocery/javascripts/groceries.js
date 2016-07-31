var App = {
  init: function() {
    this.Items = new ItemsCollection(items_json);
    this.View = new ItemsView({ collection: this.Items })
    this.Items.sortByName();
  }
};

var ItemModel = Backbone.Model.extend({
  idAttribute: "id",

  initialize: function() {
    this.collection.incrementID();
    this.set("id", this.collection.last_id);
  }
});

var ItemsCollection = Backbone.Collection.extend({
  last_id: 0,
  model: ItemModel,

  incrementID: function() {
    this.last_id++;
  },

  sortByProp: function(prop) {
    this.comparator = prop;
    this.sort();
    this.trigger('rerender')
  },

  sortByName: function() { this.sortByProp("name"); },

  initialize: function() {
    // this.on("remove reset", App.View.render.bind(App.View));
    this.on("add", this.sortByName);
  }
});

Handlebars.registerPartial("item", $("#item").html());

var ItemsView = Backbone.View.extend({
  el: $('tbody')[0],
  template: Handlebars.compile($("#items").html()),
  events: {
    'click a': 'removeItem'
  },

  render: function() {
    this.$el.html(this.template({ items: this.collection.toJSON() }))
  },

  removeItem: function(e) {
    e.preventDefault();
    var model = this.collection.get(+$(e.target).attr("data-id"));
    this.collection.remove(model);
  },

  initialize: function() {
    this.render();
    this.listenTo(this.collection, 'remove reset rerender', this.render);
  }
});

$("form").on("submit", function(e) {
  e.preventDefault();
  var $f = $(this),
      name = $f.find('[name="name"]').val(),
      quantity = +$f.find('[name="quantity"]').val();

  item = App.Items.add({ name: name, quantity: quantity });
  this.reset();
});

$("th").on("click", function() {
  var prop = $(this).attr("data-prop");
  App.Items.sortByProp(prop);
});

$("p a").on("click", function(e) {
  e.preventDefault();
  App.Items.reset();
});

App.init();