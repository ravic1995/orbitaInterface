Router.route('/login' , function() {
	this.render('login');
});

Router.route('/' , function(){
	this.render('main');
});

Router.route('/calendar' , function(){
	this.render('calendar1');
});

Router.route('/projectImageItem' , function(){
	this.render('projectImageItem');
});

Router.route('/myTemplate' , function(){
	this.render('myTemplate');
})


