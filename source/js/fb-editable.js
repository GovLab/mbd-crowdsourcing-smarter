$(document).ready(function() {

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
  }

  // MESSAGE HANDLING
  function handleAdminErrors(err, view) {
    $(view).text(err);
  }

  function messageHandler(message) {
    $('#data-panel').text(message);
    setTimeout(function(){
       $('#data-panel').fadeOut();
    },1000);
  }

});