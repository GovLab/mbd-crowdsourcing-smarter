$(document).ready(function() {

$("#entry_1253314825").val("firstName!!");
$("#entry_579020446").val("lastName!!");
$("#entry_945637751").val("email!!");
$("#entry_1431036681").val("organization!!");
$("#entry_2034790886").val("aboutMeRequired!!");
$("#entry_1375254264").val("aboutMeNotRequired!!");
$("#entry_1389641910").val("city!!");
$("#entry_344739365").val("country!!");
$("#entry_2129327437").val("otherParticipants!!");

  $('#form-submit').on("click", function(e) {
    e.preventDefault();
    postFormToGoogle()
  })

    function postFormToGoogle() {


      var firstName = $("#entry_1253314825").val(),
          lastName = $("#entry_579020446").val(),
          email = $("#entry_945637751").val(),
          organization = $("#entry_1431036681").val(),
          conferenceSelection1 = $('input[name="entry.1463462154"]:checked').val(),
          conferenceSelection1 = $("#group_1463462154_1").is(':checked'),
          conferenceSelection2 = $("#group_1463462154_2").is(':checked'),
          pastParticipantsYes = $('#group_351358348_1').is(":checked"),
          pastParticipantsNo = $('#group_351358348_2').is(":checked"),
          aboutMeRequired = $("#entry_2034790886").val(),
          aboutMeNotRequired = $("#entry_1375254264").val(),
          city = $("#entry_1389641910").val(),
          country = $("#entry_344739365").val(),
          otherParticipants = $("#entry_2129327437").val();
          
          console.log(firstName, lastName, email, organization,  conferenceSelection1, conferenceSelection2,pastParticipantsYes, pastParticipantsNo, aboutMeRequired, aboutMeNotRequired, city, country, otherParticipants)
      // $.ajax({
      //   url: "https://docs.google.com/forms/d/e/1FAIpQLSfJi9uBy980257VgRSzrlHLXl65Eqj_1B13fFRaUrv62Gufkw/formResponse",
      //   data: {
      //     "entry_768696247" : firstName,
      //     "entry_433155082" : lastName,
      //     "entry.1995814521" : email,
      //     "entry_406290142" : subscribeLabel,
      //     "group_751757517_1" : digestCheckbox,
      //     "group_751757517_2" : newsletterCheckbox,
      //     "group_751757517_3" : eventsCheckbox,
      //     "entry_1326845682" : organization,
      //     "entry_822060000" : title,
      //     "entry_26757557" : city,
      //     "entry_897178278" : state,
      //     "entry_266574318" : country,
      //     "entry_1038100862" : reasonForVisit,
      //     "entry_792513502" : permissionLabel,
      //     "group_508257337_1" : permissionsYes,
      //     "group_508257337_2" : permissionsNo,
      //     "entry_2034041479" : feedback
      //   },
      //   type: "POST",
      //   dataType: "xml",
      //   statusCode: {
      //   0: function () {
      //     console.log("Cool");
      //     // window.location.replace("thank-you.html");
      //   },
      //   200: function () {
      //     // window.location.replace("thank-you.html");
      //     console.log("Cooler")
      //     }
      //   }
      // });
    }
});