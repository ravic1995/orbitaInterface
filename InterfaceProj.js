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
Tokens = new Mongo.Collection('tokens');//Meteor.userId()==token ;
Todos = new Mongo.Collection('todos');//Metoer.userId() == todo == priority 
Calendars = new Mongo.Collection('calendars');//


if (Meteor.isClient) {
  
   Template.main.created = function(){
        if(Session.get('token1')===undefined){
   //  window.location.assign('https://ivle.nus.edu.sg/api/login/?apikey=0J5cKRFGUQASyFHiJ07v4&url=http://localhost:3000');
          Session.set('token1' , window.location.href.split('=')[1]);
          console.log(Session.get('token1'));
          }
    };
  
 // Session.set('token1' , null);
 // Meteor.startup(function(){
 //   if(Session.get('token')=== null){
 //     Router.go('https://ivle.nus.edu.sg/api/login/?apikey=0J5cKRFGUQASyFHiJ07v4&url=https://localhost:3000')  
 //   } 
 // });


   
    Meteor.setInterval(function(){
      Session.set('time' , new Date);
    } , 5000);
    Meteor.subscribe('calendars');
    Meteor.subscribe('tokens');
    Meteor.subscribe('todos');
    
    

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

  Template.leftcol.helpers({
    module : function(){
      var module = Meteor.call('modules',function(err,res){
        console.log(res);
        var results = res.data.Results;
        console.log(results);
        Session.set('r' , results)
        });
      return Session.get('r');
    }
  });

 
Modal.allowMultiple = true
  Template.rightcol.events({
    'click #cv' : function(e,t){
        e.preventDefault();
      setTimeout(function(){
        Modal.show('calendar1')
    }, 3)
    }, 
    'mouseenter .ch' : function(e,t){
      e.preventDefault();
      Modal.show('calendar1')
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
      window.location.assign('https://ivle.nus.edu.sg/api/login/?apikey=0J5cKRFGUQASyFHiJ07v4&url=http://localhost:3000/login');
//      Router.render('https://ivle.nus.edu.sg/api/login/?apikey=0J5cKRFGUQASyFHiJ07v4&url=https://localhost:3000');
       var token = window.location.href.split('=')[1];
       Session.set('token' , token)
       console.log(Session.get('token'));
    }
  });

//////////
/*Template.myTemplate.dayClick = function(date,jsEvent,view){
  $('#EditEventModal').modal();
              Calendars.insert({title:'New Item',start:date,end:date});
              console.log(Calendars.find().fetch());
              

              console.log('click successful');
}*/
Template.myTemplate.rendered = function(){
  $(window).load(function(){
        $('#myModal').modal('hide');
    });
}

Template.editEvent.events({
  'click .save':function(evt,tmpl){
    console.log(tmpl.find('.title').value);    
    Meteor.call('addCalendarEvents' , Session.get('date'),tmpl.find('.title').value);

    tmpl.find('.title').value = "";
    Session.set('editing_calevent',null);
    Session.set('showEditEvent',false);
    $('#EditEventModal').modal("hide");
    },
  'click .close':function(evt,tmpl){
    Session.set('editing_calevent',null);
    Session.set('showEditEvent',false);
    $('#EditEventModal').modal("hide");
  } ,
  'click .remove':function(evt,tmpl){
    //removeCalEvent(Session.get('editing_calevent'));
    Session.set('editing_calevent',null);
    Session.set('showEditEvent',false);
    $('#EditEventModal').modal("hide");
  }
})
Template.myTemplate.helpers({
        calendarOptions:function() {
            // Standard fullcalendar options
            return {
            height:40,
            contentHeight : 400,
            aspectRatio : 1,
            fixedWeekCount : false,
            hiddenDays: [],
            slotDuration: '01:00:00',
            minTime: '08:00:00',
            maxTime: '19:00:00',
            lang: 'en',
            // Function providing events reactive computation for fullcalendar plugin
            events: function(start, end, timezone, callback) {
                //console.log(start);
                //console.log(end);
                //console.log(timezone);
                var events = [];
                // Get only events from one document of the Calendars collection
                // events is a field of the Calendars collection document
                var calendar = Calendars.findOne(
                    { "_id":"myCalendarId" },
                    { "fields": { 'events': 1 } }
                );
                // events need to be an array of subDocuments:
                // each event field named as fullcalendar Event Object property is automatically used by fullcalendar
                if (calendar && calendar.events) {
                    calendar.events.forEach(function (event) {
                        eventDetails = {};
                        for(key in event)
                            eventDetails[key] = event[key];
                        events.push(eventDetails);
                    });
                }
                callback(events);
            },
            dayClick : function(date,jsEvent,view){
              $('#EditEventModal').modal('show');
              Session.set('date',date.format());
              //Meteor.call('addCalendarEvents' , date,  Session.get('content') );
              console.log(Calendars.find().fetch());

              console.log('click successful');

            },
            // Optional: id of the calendar
            id: "calendar1",
            // Optional: Additional classes to apply to the calendar
            addedClasses: "col-md-8",
            // Optional: Additional functions to apply after each reactive events computation
            autoruns: [
                function () {
                    console.log("user defined autorun function executed!");
                }
            ]
        };
      }
    });
    ////////



}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('calendar', function () {
  return Calendar.find();
});
    Meteor.publish('todos' , function(){
      return Todos.find();
    });
    Meteor.publish('tokens' , function(){
      return Tokens.find();
    });
    
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
  },
    addCalendarEvents : function(date , content){
      Calendars.insert({userId : Meteor.userId , date : date , content : content})
    },
    modules : function(){
      var t = HTTP.get('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=0J5cKRFGUQASyFHiJ07v4&AuthToken=4DD98A4C7FF723C0FBFDE2965B5ED3EBF4F68AF8D58E3E043A9BD9B076FD22B0292B01595C97115352E3FED29546ED4FA0A9988A100C41A5FCCDA23EE7A0F83CBCE99EBB6F5828AA5F7B49D908139232B955BF4471964B82A117A0DF718C05EB5BA6ED9484FE18DEA814D1C2A6CEEB5AE226727F2B5C87F27F5C8ED74DE8B405CC29EDAEE89784A14ECFCD51E350393F61CB8AA42F17CBBB13ADFF8ABF5CF3A7CE75C1DE79882D695BAC4F9625FF431D822404C8ABD9932512F96CA8C726534211A5CF0C0476844C6AD82F8F46FE26D4A9C09B6C94D500AEF41E33FF8D4A488B29E6B57F9BD9E04CE6A947CD5BD10036');
      return t; 
    }
    });
    // code to run on server at startup
  });
}
