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
    dbRef.on("value",function(snapshot){
      snapshot.forEach(function(snap) {
        $(view).append("<div class='"+ snap.key +"'><h3>" + snap.key + "</h3></div>");
      });
      snapshot.forEach(function(snap) {
        snap.forEach(function(s) {
          var selector = snap.key;
          if (selector == s.ref.parent.key) {
            $("div[class*='"+selector+"']").append("<a id='"+s.key+"' class='list-menu-item b-button'"+ s.ref.parent.key +">"+ s.val().title +"</a>");
          }
        });
      });
    });
  }

  // TOGGLE MENU
  $('body').on('click', '.admin-toggle>h3', function() {
    $(this).parent().children().slice(1).toggle();
  })

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

//   // RENDERS ITEM FORM WHEN CLICKED IN MENU
//   // MENU CONTROLS
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


// // MODELS
// // Conference
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
    form+= "<div class='admin-toggle main-text-fields'> <h3>Main Text Fields</h3> <form id='"+ key +"' class='b-form'>";
    form += "<input id='parent' type='hidden' value='"+ this.collectionName +"'";
    form+= "<label>Title<input type='text' name='title' id='title' value='" + this.title  + "'/></label><br>";
    form+= "<label>Subtitle<input type='text' name='subtitle' id='subtitle' value='" + this.subtitle  + "'/></label><br>";
    form+= "<label>Date<input type='text' name='date' id='date' value='" + this.date  + "'/></label><br>";
    form+= "<label>Time<input type='text' name='time' id='time' value='" + this.time  + "'/></label><br>";
    form+= "<label>Goals Description<textarea id='goals_description'>" + this.goals_description  + "'</textarea></label><br>";
    form+= "<label>Goals List<textarea id='goals_list'>" + this.goals_list  + "</textarea></label><br>";
    form+= "<label>Agenda<input type='text' name='agenda' id='agenda' value='" + this.agenda  + "'/></label><br>";
    form+= "<label>Agenda Link<input type='text' name='agenda_link' id='agenda_link' value='" + this.agenda_link  + "'/></label><br>";
    form+= "<label>Problem Description<textarea id='problem_description'>" + this.problem_description  + "</textarea></label><br>";
    form+= "<label>Problem Description Link<input type='text' name='problem_description_link' id='problem_description_link' value='" + this.problem_description_link  + "'/></label><br>";
    form+= "<label>Pre-Conference Description<textarea id='pre_conference_description'>" + this.pre_conference_description  + "</textarea></label><br>";
    form+= "<label>Takeaways<textarea id='takeaways'>" + this.takeaways  + "</textarea></label><br>";
    form+= "<label>Action Items<textarea id='action_items'>" + this.action_items  + "</textarea></label><br>";
    form+= "<input id='editConfButton' value='Update' type='submit'/>";
    form+= "</form></div></div></div><hr>";

// LINKS GROUP
    form += "<div class='admin-toggle shared-resources b-form' id='conferences/"+ this.key +"/shared_resources'> <h3>Shared Resources Links</h3><br>"
    form += renderFormLinks(this.shared_resources);
    form += "<input id='addLinkButton' value='Add a Link' type='submit'/></div><hr>";
    form += "<div class='admin-toggle pre-conference-links b-form'  id='conferences/"+ this.key +"/pre_conference_links'><h3>Pre-Conference Links</h3><br>"
    form += renderFormLinks(this.pre_conference_links);
    form += "<input id='addLinkButton' value='Add a Link' type='submit'/></div><hr>";

  // PARTICIPANTS GROUP
    form += "<div class='admin-toggle participants b-form' id='conferences/"+ this.key +"/participants_list'><h3>Participants List</h3><br>"
    form += renderFormParticipants(this.participants_list);
    form += "<input id='addParticipantButton' value='Add a Participant' type='submit'/></div>";

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
      // participants_list : attr.participants_list,
      takeaways : attr.takeaways,
      action_items : attr.action_items,
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
      // participants_list : $(form).find("#participants_list").val(),
      takeaways : $(form).find("#takeaways").val(),
      action_items : $(form).find("#action_items").val(),
    };
   debugger
    return obj;
  }

    $('body').on("click", '#editConfButton', function(e) {
    e.preventDefault();
    var obj = grabConfObjectFromForm(this.parentElement);
    var key = obj.key;
    var newConf = new Conference(obj);
    newConf.key = key;
    newConf.updateDB();
  });



// // PUBLIC VIEWS

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
    $(pageKey).find("#goals_list").html(textAreaToList(conferenceSnap.val().goals_list));
    $(pageKey).find("#agenda").text(conferenceSnap.val().agenda);
    $(pageKey).find("#agenda_link").attr("href", conferenceSnap.val().agenda_link);
    $(pageKey).find("#problem_description").text(conferenceSnap.val().problem_description);
    $(pageKey).find("#problem_description_link").attr("href", conferenceSnap.val().problem_description_link);
    $(pageKey).find("#pre_conference_description").text(conferenceSnap.val().pre_conference_description);
    $(pageKey).find("#pre_conference_links").html(renderLinks(conferenceSnap.val().pre_conference_links));
    $(pageKey).find("#participants_list").html(renderParticipants(conferenceSnap.val().participants_list));
    $(pageKey).find("#takeaways").html(textAreaToList(conferenceSnap.val().takeaways));
    $(pageKey).find("#action_items").html(textAreaToList(conferenceSnap.val().action_items));
    $(pageKey).find("#shared_resources").html(renderLinks(conferenceSnap.val().shared_resources));
  }


  function textAreaToList(obj) {
    var listHtml = "";
    var arr = obj.split(/\n/g);
    arr.forEach(function(string) {
      listHtml += "<li>" + string + "</li>";
    });
    return listHtml;
  }

  function addLink(location, attr) {
    title = attr.title,
    url = attr.url
  }

  var Link = function(attr) {
    this.key = attr.key || "";
    this.title = attr.title,
    this.url = attr.url, 
    this.renderHtml = function() {
      return "<li class='e-link-item'><div class='row'><div class='large-6 large-offset-1 column'><a href= '"+this.url+"'><p class='e-link-title'>"+this.title+"</p></a></div></div></li>";
    }
    this.renderForm = function() {
      var form = "<div class='b-form-links' id='"+this.key+"'>";
      form += "<label>Link Title<input type='text' name='link_title' id='link_title' value='" + this.title  + "'/></label>";
      form += "<label>Link URL<input type='text' name='link_url' id='link_url' value='" + this.url  + "'/></label>"
      form+= "<a id='editLinkButton'><i class='material-icons'>mode_edit</i></a><a id='deleteLinkButton'><i class='material-icons'>delete</i></a></div>";
      return form;
    }
    this.updateDB = function(refPath) {
      var linkRef = firebase.database().ref(refPath)
      linkRef.update({
        title : attr.title,
        url : attr.url
      }, onComplete)
    }
  }


  $('body').on("click", '#editLinkButton', function(e) {
    e.preventDefault();
    var parentPath = this.parentElement.parentElement.id + "/" +this.parentElement.id;
    var link = new Link({
      title: $(this).parent().find("#link_title").val(), 
      url: $(this).parent().find("#link_url").val()
      });
    link.key = this.parentElement.id;
    link.updateDB(parentPath);
  });

    $('body').on("click", '#deleteLinkButton', function(e) {
    e.preventDefault();
    var parentPath = this.parentElement.parentElement.id + "/" +this.parentElement.id;
    var linkRef = firebase.database().ref(parentPath);
    linkRef.remove().then(onComplete);

  });

    $('body').on("click", '#addLinkButton', function(e) {
    e.preventDefault();
    var parentPath = this.parentElement.id;
    $(this.parentElement).append(renderNewLinkForm());
  });

    $('body').on("click", '#submitLinkButton', function(e) {
    e.preventDefault();
    var parentPath = this.parentElement.parentElement.id;
    var linkTitle = $(this).parent().find("#link_title").val();
    var linkURL = $(this).parent().find("#link_url").val();
    var linkRef = firebase.database().ref(parentPath);
    linkRef.push({title: linkTitle, url: linkURL}, onComplete)
  });

  function renderNewLinkForm(){
    var form = "<div id='addLink'>";
    form += "<label>Link Title<input type='text' name='link_title' id='link_title' placeholder='Link Title' value=''/></label>";
    form += "<label>Link URL<input type='text' name='link_url' id='link_url' placeholder='Link URL' value=''/></label>"
    form += "<input id='submitLinkButton' value='Submit' type='submit'/></div>";
    return form;
  }

  function renderLinks(obj) {
    var linksHtml = "";
    for (variable in obj) {
      linksHtml += new Link(obj[variable]).renderHtml();
    }
    return linksHtml;
  }

  function renderFormLinks(links){
    var linksGroup = "";
    for (link in links) {
      var key = link;
      var child = links[link];
      linksGroup += new Link({key:link, title: child.title, url: child.url}).renderForm();
    }
    return linksGroup;
  }


// PARTICIPANTS 

var Participant = function(attr) {
  this.key = attr.key || "";
  this.title = attr.title,
  this.affiliation = attr.affiliation, 
  this.twitter = attr.twitter || ""
  this.renderHtml = function() {
    return "<li><strong>" + this.title +" <a href=\'"+ this.twitter +" target=\'_blank\'><span class=\'fa fa-twitter\' aria-hidden=\'true\'></span></a></strong> "+ this.affiliation +"</li>";
  },
  this.renderForm = function() {
    var form = "<div class='b-form-' id='"+this.key+"'>";
    form += "<label>Participant Title<input type='text' name='participant_title' id='participant_title' value='" + this.title  + "'/></label>";
    form += "<label>Participant Affiliation<input type='text' name='participant_affiliation' id='participant_affiliation' value='" + this.affiliation  + "'/></label>"
    form += "<label>Participant Twitter<input type='text' name='participant_twitter' id='participant_twitter' value='" + this.twitter  + "'/></label>"
    form+= "<a id='editParticipantButton'><i class='material-icons'>mode_edit</i></a><a id='deleteParticipantButton'><i class='material-icons'>delete</i></a></div><hr>";
    return form;
  },
  this.updateDB = function(refPath) {
    var participantRef = firebase.database().ref(refPath)
    participantRef.update({
      title : attr.title,
      affiliation : attr.affiliation,
      twitter : attr.twitter
    }, onComplete)
  }
}


  $('body').on("click", '#editParticipantButton', function(e) {
    e.preventDefault();
    var parentPath = this.parentElement.parentElement.id + "/" +this.parentElement.id;
    var participant = new Participant({
      title: $(this).parent().find("#participant_title").val(), 
      twitter: $(this).parent().find("#participant_twitter").val(), 
      affiliation: $(this).parent().find("#participant_affiliation").val()
      });
    participant.key = this.parentElement.id;
    participant.updateDB(parentPath);
  });

    $('body').on("click", '#deleteParticipantButton', function(e) {
    e.preventDefault();
    var parentPath = this.parentElement.parentElement.id + "/" +this.parentElement.id;
    var participantRef = firebase.database().ref(parentPath);
    participantRef.remove().then(onComplete);

  });

    $('body').on("click", '#addParticipantButton', function(e) {
    e.preventDefault();
    var parentPath = this.parentElement.id;
    $(this.parentElement).append(renderNewParticipantForm());
  });

    $('body').on("click", '#submitParticipantButton', function(e) {
      console.log();
    e.preventDefault();
    var parentPath = this.parentElement.parentElement.id,
        participantTitle = $(this).parent().find("#participant_title").val(),
        participantTwitter = $(this).parent().find("#participant_twitter").val(),
        participantAffiliation = $(this).parent().find("#participant_affiliation").val(),
        participantRef = firebase.database().ref(parentPath);
    participantRef.push({title: participantTitle, twitter: participantTwitter, affiliation: participantAffiliation}, onComplete)
  });

  function renderNewParticipantForm(){
    var form = "<div id='addParticipant'>";
    form += "<label>Participant Title<input type='text' name='participant_title' id='participant_title' placeholder='Participant Title' value=''/></label>";
    form += "<label>Participant Affiliation<input type='text' name='participant_affiliation' id='participant_affiliation' placeholder='Participant Affiliation' value=''/></label>"
    form += "<label>Participant Twitter<input type='text' name='participant_twitter' id='participant_twitter' placeholder='Participant Twitter' value=''/></label>"
    form += "<input id='submitParticipantButton' value='Submit' type='submit'/></div>";
    return form;
  }

  function renderParticipants(obj) {
    var participantsHtml = "";
    for (variable in obj) {
      participantsHtml += new Participant(obj[variable]).renderHtml();
    }
    return participantsHtml;
  }

  function renderFormParticipants(participants){
    var participantsGroup = "";
    for (participant in participants) {
      var key = participant;
      var child = participants[participant];
      participantsGroup += new Participant({key:participant, title: child.title, twitter: child.twitter, affiliation: child.affiliation}).renderForm();
    }
    return participantsGroup;
  }

// LINKS SEED

  // var linkRef = firebase.database().ref("conferences/-KLHU5llqXmAmPZBzFfh/shared_resources");
  // linkRef.push({title:"Example Website 3", url: "www.example.com"})

  //   var linkRef = firebase.database().ref("conferences/-KLIR40URSpfiPFhI-4x/shared_resources");
  // linkRef.push({title:"Example Website 2", url: "www.example.com"})


// Participants SEED

// var people = [{title:"Stefaan Verhulst",  twitter: "https://twitter.com/thegovlab", affiliation: "The GovLab, NYU Tandon School of Engineering (Co-chair)"},      
// {title:"Andrew Young",  twitter: "https://twitter.com/_AndrewYoung", affiliation: "The GovLab, NYU Tandon School of Engineering"}]


// var participantsRef = firebase.database().ref("conferences/-KLHU5llqXmAmPZBzFfh/participants_list");
// people.forEach(function(person) {
//   participantsRef.push({
//     title: person.title,
//     twitter: person.twitter,
//     affiliation: person.affiliation
//   })
// })

// console.log(people.length);
});























