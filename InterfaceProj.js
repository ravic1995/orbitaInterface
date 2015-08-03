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
//Calendars = new Mongo.Collection('calendars');//

var Schemas = {};
Schemas.Token = new SimpleSchema({
  userId :{
    type : String,
    label : "userId",
  } ,
  token :{
    type : String , 
    label : "tokenOfUser",
  }
});
Tokens.attachSchema(Schemas.Token);


if (Meteor.isClient) { 
Meteor.setInterval(function(){
  Session.set('time' , new Date);
} , 5000);

Meteor.subscribe('calendar', function () {
  Session.set('superCalendarReady', true);
});
    Meteor.subscribe('tokens');
    Meteor.subscribe('todos');
    
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
        //var results = res.data.Results;
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
        $('#calendar').modal('show');
    } 
  });

  Template.rightcol.helpers({
    date : function(){
      return moment(Session.get('time')).format("D MMM");
    },
    weather2 : function(){
      var out="" ; 
      var currWeather = Meteor.call('weather' , function(err,res){
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
if(!(Meteor.loggingIn() || Meteor.user())){
    Blaze.render(Template.login , document.body );
    $('#login').modal('show');
} 

/*  if(!Meteor.userId()){
    Blaze.render(Template.login , document.body );
    //$('#login').modal('show');
    //Router.go('/login');
    $('#login').modal('show');
  }*/

  Template.login.events({
    'click button' : function(event){
        Router.go('/ivlelogin' , function(){
        this.render('ivleLogin');
      }); 
    }
  });


//use onBefore actions as well as on after 
//render page using the router and the routing this ?? 
//make the template on rendered as a modal
//////////
/*Template.myTemplate.dayClick = function(date,jsEvent,view){
  $('#EditEventModal').modal();
              Calendars.insert({title:'New Item',start:date,end:date});
              console.log(Calendars.find().fetch());
              

              console.log('click successful');
}*/

Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Todos.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      Todos.remove(this._id);
    }
  });
 Template.todo.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Todos.find({checked: {$ne: true}, owner : Meteor.userId()}, {sort: {createdAt: -1,priority : -1}});
      } else {
        // Otherwise, return all of the tasks
        return Todos.find({owner : Meteor.userId()}, {sort: { priority : -1 , createdAt: -1 }});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Todos.find({checked: {$ne: true} ,owner : Meteor.userId()} ).count();
    }
  });


SuperCalendar.rendered = function () {
var self = this;
    self.autorun(function () {
      if (! Session.get('superCalendarReady', true) ||
          typeof Calendar === 'undefined') {
        return;
      }
      var entries = Calendar.find({userId : Meteor.userId()}).fetch();
      var $calendar = $('#calendar');

      $calendar.html('').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        editable: false,
        events: entries,
        eventRender: function (event, element) {
          $(element).attr('id', event._id);
        },
        dayClick: function (date, flag, e, view) {
          return SuperCalendar.events.onDayClick.call(this, e, self, {
            date: date,
            view: view
          });
        },
        eventClick: function (date, e, view) {
          return SuperCalendar.events.onEventClick.call(this, e, self, {
            date: date,
            view: view
          });
        }
      });
    });  
};
//client id : 578942301059-us39fcth5lc1fap3mdfub3mkpnsefolo.apps.googleusercontent.com
//secret : i7LXHx9OTkBXHw6DiPDakiGq

Template.login.rendered = function(){
  $('#login').modal('show');
}

Template.ivleLogin.rendered = function(){
  var APIKey = "0J5cKRFGUQASyFHiJ07v4";
    var APIDomain = "https://ivle.nus.edu.sg/";
    var APIUrl = APIDomain + "api/lapi.svc/";
    var LoginURL = APIDomain + "api/login/?apikey=0J5cKRFGUQASyFHiJ07v4&url=http://nusinterface.meteor.com/ivleLogin";

    var myModuleInfo = null;

    //function to get the query string parameters
    var search = function () {
        var p = window.location.search.substr(1).split(/\&/), l = p.length, kv, r = {};
        while (l--) {
            kv = p[l].split(/\=/);
            r[kv[0]] = kv[1] || true; //if no =value just set it as true
        }
        console.log(r);
        return r;
    } ();


    //variable to store the Authentication Token
    var Token = "";

    //check query string for search token
    if (search.token && search.token.length > 0 && search.token != 'undefined') {
        Token = search.token;
        Session.set('token' , Token);
        //alert(Token);
        console.log(Session.get('token'));
        Meteor.call('tokenInsert' , Session.get('token'));
    }

    $(document).ready(function () {
        if (Token.length < 1) {
            window.location = LoginURL;
        }
        else {
            //$('#lbl_Token').html(Token);

            Populate_UserName();

            Populate_Module();

        }
    });

    function Populate_UserName() {
        var url = APIUrl + "UserName_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + Token;
        $('#dbg_UserInfo').append("<span>Request: " + url + "</span><br />");

        jQuery.getJSON(url, function (data) {
            $('#lbl_Name').html(data);
            $('#dbg_UserInfo').append("<span>Response: " + data + "</span>");
        });
    }

    function Populate_Module() {
        var ModuleURL = APIUrl + "Modules?APIKey=" + APIKey + "&AuthToken=" + Token + "&Duration=1&IncludeAllInfo=false&output=json&callback=?";
        $('#dbg_Modules').append("<span>Request: " + ModuleURL + "</span><br />");

        //Get all the modules belonging to me
        jQuery.getJSON(ModuleURL, function (data) {
            $('#dbg_Modules').append("<span>Response: " + data + "</span>");
            myModuleInfo = data;


            var lbl_Module = "";
            for (var i = 0; i < data.Results.length; i++) {
                var m = data.Results[i];

                //output the course code, acadyear and coursename
                lbl_Module += m.CourseCode + " " + m.CourseAcadYear + " - " + m.CourseName;

                //if there's new notifications add it in at the end
                if (m.Badge > 0)
                    lbl_Module += " (" + m.Badge + ")";

                //put a line break
                lbl_Module += "<br />";

                //get the tools belonging to this module
                lbl_Module += "<span id='announcement_" + m.ID + "' />";
                lbl_Module += "<span id='forum_" + m.ID + "' />";
                lbl_Module += "<span id='workbin_" + m.ID + "' />";
            }

            $('#lbl_Modules').html(lbl_Module);
        });
    }
    Router.go('/');
}

  Template.todo.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;
      var priority = event.target.priority.value;
      console.log(text +" " + priority);

       Meteor.call('todoInsert' , text , priority);

      // Clear form
      event.target.text.value = "";
      event.target.priority.value="1";

      // Prevent default form submit
      return false;
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });
}

/*Meteor.methods({
    weather : function(){        
    var t = HTTP.get("http://api.openweathermap.org/data/2.5/weather?q=singapore&APPID=860925b0e2933e51a216953566d0964d").data;
    return t;
  },
    addCalendarEvents : function(date , content){
      Calendars.insert({userId : Meteor.userId() , date : date , content : content})
    },
    modules : function(){
      var t = HTTP.get('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=0J5cKRFGUQASyFHiJ07v4&AuthToken=4DD98A4C7FF723C0FBFDE2965B5ED3EBF4F68AF8D58E3E043A9BD9B076FD22B0292B01595C97115352E3FED29546ED4FA0A9988A100C41A5FCCDA23EE7A0F83CBCE99EBB6F5828AA5F7B49D908139232B955BF4471964B82A117A0DF718C05EB5BA6ED9484FE18DEA814D1C2A6CEEB5AE226727F2B5C87F27F5C8ED74DE8B405CC29EDAEE89784A14ECFCD51E350393F61CB8AA42F17CBBB13ADFF8ABF5CF3A7CE75C1DE79882D695BAC4F9625FF431D822404C8ABD9932512F96CA8C726534211A5CF0C0476844C6AD82F8F46FE26D4A9C09B6C94D500AEF41E33FF8D4A488B29E6B57F9BD9E04CE6A947CD5BD10036' , {rejectUnauthorized: false});
      return t; 
    },

    todoInsert : function(text,priority){
       Todos.insert({
        text: text,
        priority : priority,
        createdAt: new Date(),            // current time
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().username  // username of logged in user
      });
    } 
  });*/



if (Meteor.isServer) {
  Meteor.methods({
    weather : function(){        
    var t = HTTP.get("http://api.openweathermap.org/data/2.5/weather?q=singapore&APPID=860925b0e2933e51a216953566d0964d").data;
    return t;
  },
    addCalendarEvents : function(date , content){
      Calendars.insert({userId : Meteor.userId() , date : date , content : content})
    },
   /* modules : function(token){
      var t = HTTP.get('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=0J5cKRFGUQASyFHiJ07v4&AuthToken=' + token , {rejectUnauthorized: false});
      return t; 
    },
    */
    modules : function(){
      var t = HTTP.get('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=0J5cKRFGUQASyFHiJ07v4&AuthToken=' + Tokens.findOne({userId : Meteor.userId()}).token , {rejectUnauthorized: false});
      return t; 
    },
    tokenInsert : function(token){
       Tokens.insert({
        userId : Meteor.userId(),
        token : token
       }); 
    },
    
    todoInsert : function(text,priority){
       Todos.insert({
        text: text,
        priority : priority,
        createdAt: new Date(),            // current time
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().username  // username of logged in user
      });
    } 
  });
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
   });
}
