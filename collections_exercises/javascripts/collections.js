// var Post = Backbone.Model.extend({
//   url: "http://jsonplaceholder.typicode.com/posts",
// });

// var Posts = Backbone.Collection.extend({
//   model: PostModel,
//   url: "http://jsonplaceholder.typicode.com/posts",
// });
var template = Handlebars.compile($('#users').html());

// User model
var User = Backbone.Model.extend({
  url: "http://jsonplaceholder.typicode.com/users"
});

var Users = Backbone.Collection.extend({
  url: "http://jsonplaceholder.typicode.com/users",
  model: User,
  initialize: function() {
    this.on('sync sort', render)
  }
});

var users_roll = new Users();
users_roll.fetch({
  success: function(collection) {
    console.log(collection.toJSON());
  }
});

users_roll.create({ name: "Naveed", email: "nf01@gmail.com"}, {
  success: function(user) {
    console.log(user.toJSON());
  }
});

function render() {
  $(document.body).prepend(template({users: this.toJSON()}));
}