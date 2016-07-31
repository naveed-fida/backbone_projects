var product_template = Handlebars.compile($('#product').html());
var form_template = Handlebars.compile($('#form').html());

var ProductModel = Backbone.Model.extend({
  setDate: function() {
    var date = new Date(this.get('date'));
    this.set('datetime', date.toISOString());
    this.set('date_formatted', date.toLocaleString('us'));
  },

  initialize: function() {
    this.setDate();
    this.on('change', function(model) {
      model.setDate();
      renderModel();
    });
  }
});

var product = new ProductModel(product_json);
renderModel();

function renderModel() {
  $('article').html(product_template(product.toJSON()));
  $('form fieldset').html(form_template(product.toJSON()));
}

$('form').on('submit', function(e) {
  e.preventDefault();
  var $form = $(this),
      name = $form.find('[name="name"]').val(),
      description = $form.find('[name="description"]').val();
  product.set('name', name);
  product.set('description', description);
  product.set('date', +new Date());
});