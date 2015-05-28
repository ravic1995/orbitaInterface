/*if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
*/

if (Meteor.isClient) {

    Meteor.setInterval(function(){
      Session.set('time' , new Date);
    } , 1000);

    //var time = Blaze.Var(new Date);
    //setInterval(function(){time.set(new Date);}, 1000);

  Template.header.helpers({ 
    timedis : function(){
      //new variable to keep track of the time 
    //then the time is returned in a desired format using a segment of moment js 
     // var out = time.get();
    // the format can be changed by referring to moment JS... moment JS is already included in the package 
      return moment(Session.get('time')).format(" D MMM h:mm a");
//      timedis.setInterva(timedis,1000);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
