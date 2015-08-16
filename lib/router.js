Router.route('/login' , function() {
	this.render('login');
});

Router.route('/loginButtons');

Router.route('/trial');

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



var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {
    if (!(Meteor.user() || Meteor.loggingIn())) {
       Router.go('login');
    } else {
        this.next();
    }
  }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    except :['login']
});