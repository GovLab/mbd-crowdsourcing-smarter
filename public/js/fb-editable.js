$(document).ready(function() {

  var dbRef = firebase.database().ref('/');
  var conferencesRef = firebase.database().ref('conferences/');


  // AUTHENTICATION
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.email + " - User is signed in.");
      renderAdminView(user);
    } else {
      console.log("No User is signed in.");
      renderPublicView();
    }
  });

  // Sign In
  $("#login").on("click", function(e) {
    e.preventDefault();
    var email = $('#login-email').val();
    var password = $('#login-password').val();
    signIn(email, password);
  });

  function signIn(email,password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      handleAdminErrors(error.message, "#login-message");
    });
  }

  // Sign Out
  $("#logout").on("click", function(e){
    e.preventDefault();
    signOut();
    renderPublicView();
    location.reload();
  });

  function signOut() {
    firebase.auth().signOut().then(function() {
      console.log("Signed Out");
    }, function(error) {
      console.log(error);
    });
  }

  // ADMIN VIEWS
  function renderPublicView() {
    handleAdminErrors("Please sign in", "#login-message");
    $("#logout").hide();
    $(".admin-view").hide();
    $("#auth").hide();
  }

  function renderAdminView(user) {
    $(".b-top-section").hide();
    $(".admin-view").show();
    $("#auth").show();
    $('#current-user').text(user.email);
    $("#logout").show();
    populateEditMenu("#data-menu");
  }

  // Message Handling
  function handleAdminErrors(err, view) {
    $(view).text(err);
  }

  function messageHandler(message) {
    $('#data-panel').text(message);
    setTimeout(function(){
       $('#data-panel').fadeOut();
    },1000);
  }

  // Error Handling
  var onComplete = function(error) {
    if (error) {
      console.log('Synchronization failed');
      console.log(error);
      handleAdminErrors(error.valueOf(), "#login-message");
      alert(error.valueOf());
    } else {
      console.log('Synchronization succeeded');
      messageHandler("Synchronization succeeded");
      $("#data-menu").empty();      
      populateEditMenu("#data-menu");
    }
  };

  // Populate Edit Menu
  function populateEditMenu(view) {
    dbRef.once("value",function(snapshot){
      snapshot.forEach(function(snap) {
        $(view).append("<div class='"+ snap.key +"'><h3>" + snap.key + "</h3></div>");
      });
      snapshot.forEach(function(snap) {
        snap.forEach(function(s) {
          var selector = snap.key;
          if (selector == s.ref.parent.key) {
            $("div[class*='"+selector+"']").append("<a id='"+s.key+"' class='list-menu-item b-button '"+ s.ref.parent.key +">"+ s.val().title +"</a>");
          }
        });
      });
    });
  }

  // Render New Edit Form
  function renderNewEditForm(parent, child) {
    var parentRef = dbRef.child(parent);
    var childRef = parentRef.child(child);
    if (childRef.parent.key == 'open-expert') {
        childRef.once("value", function(snapshot) {
        var oe = new OpenExpert(snapshot.val());
        oe['key'] = snapshot.key();
        oe.renderForm(oe.key, "#data-panel");
      });
    } else if (childRef.parent.key == 'conferences') {
        childRef.once("value", function(snapshot){
          var conf = new Conference(snapshot.val());
          conf['key'] = snapshot.key;
          console.log(conf);
          conf.renderForm(conf.key, "#data-panel");
        });
    };
  }

  // RENDERS ITEM FORM WHEN CLICKED IN MENU
  // MENU CONTROLS
  $("body").on("click", ".list-menu-item", function(e) {
    e.preventDefault();
    $("#data-panel").empty();
    $("#data-panel").show();
    console.log('menuitem button');
    $('#admin-list-item').remove();
    var parentRoot = $(this).parent().attr('class');
    var childID = $(this).attr('id');
    renderNewEditForm(parentRoot,childID);
  });


  // CREATE
  function addNewConference(obj) {
    conferencesRef.push(obj);
  }


// MODELS
// Conference
var Conference = function (attr) {
  this.collectionName = "conferences";
  this.ref = conferencesRef;
  this.key = attr.key || "";
  this.title = attr.title;
  this.subtitle = attr.subtitle;
  this.date = attr.date;
  this.time = attr.time;
  this.goals_description = attr.goals_description;
  this.goals_list = attr.goals_list;
  this.agenda = attr.agenda;
  this.agenda_link = attr.agenda_link;
  this.problem_description = attr.problem_description;
  this.problem_description_link = attr.problem_description_link;
  this.pre_conference_description  = attr.pre_conference_description;
  this.pre_conference_links = attr.pre_conference_links;
  this.participants_list = attr.participants_list;
  this.takeaways = attr.takeaways;
  this.action_items = attr.action_items;
  this.shared_resources = attr.shared_resources;
  this.renderForm = function(key, view) {
    var form = "";
    form+= "<form id='"+ key +"' class='b-form'>";
    form += "<input id='parent' type='hidden' value='"+ this.collectionName +"'";
    form+= "<label>Title<input type='text' name='title' id='title' value='" + this.title  + "'/></label><br>";
    form+= "<label>Subtitle<input type='text' name='subtitle' id='subtitle' value='" + this.subtitle  + "'/></label><br>";
    form+= "<label>Date<input type='text' name='date' id='date' value='" + this.date  + "'/></label><br>";
    form+= "<label>time<input type='text' name='time' id='time' value='" + this.time  + "'/></label><br>";
    form+= "<label>Goals Description<textarea id='goals_description'>" + this.goals_description  + "'</textarea></label><br>";
    form+= "<label>Goals List<input type='text' name='goals_list' id='goals_list' value='" + this.goals_list  + "'/></label><br>";
    form+= "<label>Agenda<input type='text' name='agenda' id='agenda' value='" + this.agenda  + "'/></label><br>";
    form+= "<label>Agenda Link<input type='text' name='agenda_link' id='agenda_link' value='" + this.agenda_link  + "'/></label><br>";
    form+= "<label>Problem Description<textarea id='problem_description'>" + this.problem_description  + "</textarea><br>";
    form+= "<label>Problem Description Link<input type='text' name='problem_description_link' id='problem_description_link' value='" + this.problem_description_link  + "'/></label><br>";
    form+= "<label>Pre-Conference Description<textarea id='pre_conference_description'>" + this.pre_conference_description  + "</textarea></label><br>";
    form+= "<label>Pre-Conference Links<input type='text' name='pre_conference_links' id='pre_conference_links' value='" + this.pre_conference_links  + "'/></label><br>";
    form+= "<label>Participants List<input type='text' name='participants_list' id='participants_list' value='" + this.participants_list  + "'/></label><br>";
    form+= "<label>Takeaways<input type='text' name='takeaways' id='takeaways' value='" + this.takeaways  + "'/></label><br>";
    form+= "<label>Action Items<input type='text' name='action_items' id='action_items' value='" + this.action_items  + "'/></label><br>";
    form+= "<label>Shared Resources<input type='text' name='shared_resources' id='shared_resources' value='" + this.shared_resources  + "'/></label><br>";
    form+= "<input id='editConfButton' value='Update' type='submit'/>";
    form+= "</form></div></div>";
  debugger
    $(view).append(form);
  },
  this.updateDB = function() {
    var ref =  firebase.database().ref('conferences/' + this.key);
    ref.update({
      key : attr.key,
      title : attr.title,
      subtitle : attr.subtitle,
      date : attr.date,
      time : attr.time,
      goals_description : attr.goals_description,
      goals_list : attr.goals_list,
      agenda : attr.agenda,
      agenda_link : attr.agenda_link,
      problem_description : attr.problem_description,
      problem_description_link : attr.problem_description_link,
      pre_conference_description  : attr.pre_conference_description,
      pre_conference_links : attr.pre_conference_links,
      participants_list : attr.participants_list,
      takeaways : attr.takeaways,
      action_items : attr.action_items,
      shared_resources : attr.shared_resources,
    }, onComplete);
  };
};

  function grabConfObjectFromForm(form) {
    var obj = {
      key : $(form).attr("id"),
      title : $(form).find("#title").val(),
      subtitle : $(form).find("#subtitle").val(),
      date : $(form).find("#date").val(),
      time : $(form).find("#time").val(),
      goals_description : $(form).find("#goals_description").val(),
      goals_list : $(form).find("#goals_list").val(),
      agenda : $(form).find("#agenda").val(),
      agenda_link : $(form).find("#agenda_link").val(),
      problem_description : $(form).find("#problem_description").val(),
      problem_description_link : $(form).find("#problem_description_link").val(),
      pre_conference_description  : $(form).find("#pre_conference_description").val(),
      pre_conference_links : $(form).find("#pre_conference_links").val(),
      participants_list : $(form).find("#participants_list").val(),
      takeaways : $(form).find("#takeaways").val(),
      action_items : $(form).find("#action_items").val(),
      shared_resources : $(form).find("#shared_resources").val()
    };
  
    return obj;
  }

    $('body').on("click", '#editConfButton', function(e) {
    e.preventDefault();
    var obj = grabConfObjectFromForm(this.parentElement.parentElement);
    var key = obj.key;
    var newConf = new Conference(obj);
    newConf.key = key;
    newConf.updateDB();
  });



// PUBLIC VIEWS

  function getConferences() {
  conferencesRef.on("value",function(snap) {
  var results = [];
  snap.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      results.push({key: key, value: childData});
      renderConference(childSnapshot);
    });
  });
  }

getConferences();

  function renderConference(conferenceSnap){
    var pageKey = "#" + conferenceSnap.key;
    $(pageKey).find("#title").text(conferenceSnap.val().title);
    $(pageKey).find("#subtitle").text(conferenceSnap.val().subtitle);
    $(pageKey).find("#date").text(conferenceSnap.val().date);
    $(pageKey).find("#time").text(conferenceSnap.val().time);
    $(pageKey).find("#goals_description").text(conferenceSnap.val().goals_description);
    $(pageKey).find("#goals_list").text(conferenceSnap.val().goals_list);
    $(pageKey).find("#agenda").text(conferenceSnap.val().agenda);
    $(pageKey).find("#agenda_link").attr("href", conferenceSnap.val().agenda_link);
    $(pageKey).find("#problem_description").text(conferenceSnap.val().problem_description);
    $(pageKey).find("#problem_description_link").attr("href", conferenceSnap.val().problem_description_link);
    $(pageKey).find("#pre_conference_description").text(conferenceSnap.val().pre_conference_description);
    $(pageKey).find("#pre_conference_links").text(conferenceSnap.val().pre_conference_links);
    $(pageKey).find("#participants_list").text(conferenceSnap.val().participants_list);
    $(pageKey).find("#takeaways").text(conferenceSnap.val().takeaways);
    $(pageKey).find("#action_items").text(conferenceSnap.val().action_items);
    $(pageKey).find("#shared_resources").text(conferenceSnap.val().shared_resources);
  }


});