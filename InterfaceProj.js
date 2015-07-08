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
  Session.set('token' , null);
 // Meteor.startup(function(){
 //   if(Session.get('token')=== null){
 //     Router.go('https://ivle.nus.edu.sg/api/login/?apikey=0J5cKRFGUQASyFHiJ07v4&url=https://localhost:3000')  
 //   } 
 // });

    Meteor.setInterval(function(){
      navigator.geolocation.getCurrentPosition(function(position) {
        Session.set('lat', position.coords.latitude);
        Session.set('lon', position.coords.longitude);
    });
      Session.set('time' , new Date);
    } , 5000);

    //var time = Blaze.Var(new Date);
    //setInterval(function(){time.set(new Date);}, 1000);
    //860925b0e2933e51a216953566d0964d--weather appid


   // https://ivle.nus.edu.sg/api/login/?apikey=0J5cKRFGUQASyFHiJ07v4&url=https://www.locahhost:3000
  Template.header.helpers({ 
    timedis : function(){
      //new variable to keep track of the time 
    //then the time is returned in a desired format using a segment of moment js 
     // var out = time.get();
    // the format can be changed by referring to moment JS... moment JS is already included in the package 
      return moment(Session.get('time')).format("h:mm a");
//      timedis.setInterva(timedis,1000);
    }
  });

  Template.rightcol.helpers({
    date : function(){
      return moment(Session.get('time')).format("D MMM");
    },
    weather2 : function(){
      var out="" ; 
      var currWeather = Meteor.call('weather' , function(err,res){
     // Meteor.call('weather' , function(err,response)
      //{
       // currWeather = response.weather.description;
        //Session.set('a' , currWeather);
     //   );    
      console.log(res);
      out = res.weather[0].description;
      out2 = res.weather[0].icon;
      Session.set('out' , out);
      Session.set('out2' , out2);      

});
      return Session.get('out');  
},

    icontag : function(){
      var output = "http://openweathermap.org/img/w/" + Session.get('out2') + ".png";
      return output;
    }
});

  Template.login.events({
    'click button' : function(event){
      window.location.assign('https://ivle.nus.edu.sg/api/login/?apikey=0J5cKRFGUQASyFHiJ07v4&url=http://localhost:3000');
//      Router.render('https://ivle.nus.edu.sg/api/login/?apikey=0J5cKRFGUQASyFHiJ07v4&url=https://localhost:3000');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      weather : function(){
            
//     var url = "http://api.openweathermap.org/data/2.5/weather?q=singapore&APPID=860925b0e2933e51a216953566d0964d";
  //  var res = "";
    var t = HTTP.get("http://api.openweathermap.org/data/2.5/weather?q=singapore&APPID=860925b0e2933e51a216953566d0964d").data;
    //t = t.weather.description;

   // var n = t;
    //Session.set('to' , n);
    //res = n;
    return t;
  }
    });
    // code to run on server at startup
  });
}
