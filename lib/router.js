Router.route('/login' , function() {
	this.render('login');
});

Router.route('/' , function(){
	this.render('main');
});

Router.route('/calendar' , function(){
	this.render('calendar1');
});
Router.route('/ivlelogin' , function(){
  this.render('ivleLogin');
});

Router.route('/todo' , function(){
	this.render('todo');
})



