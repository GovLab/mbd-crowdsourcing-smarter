$(document).ready(function() {

  var firstNameInput = $("#entry_1253314825"),
      lastNameInput = $("#entry_579020446"),
      emailInput = $("#entry_945637751"),
      organizationInput = $("#entry_1431036681"),
      conferenceSelection1Input = $("#group_1463462154_1"),
      conferenceSelection2Input = $("#group_1463462154_2"),
      pastParticipantsYesInput = $('#group_351358348_1'),
      pastParticipantsNoInput = $('#group_351358348_2'),
      aboutMeRequiredInput = $("#entry_2034790886"),
      aboutMeNotRequiredInput = $("#entry_1375254264"),
      cityInput = $("#entry_1389641910"),
      countryInput = $("#entry_344739365"),
      otherParticipantsInput = $("#entry_2129327437");

  var requiredFields = [firstNameInput,lastNameInput,emailInput, organizationInput, aboutMeRequiredInput, cityInput, countryInput];

  function noNullFields() { 
    var noBlankFields=true;
    requiredFields.forEach(function(data) {
      if (data.val()) {
        console.log(data.val());
        $(data).removeClass("invalid").addClass("valid");
      } else {
        $(data).removeClass("valid").addClass("invalid");
        noBlankFields = false;
      }
    });
      if (!noBlankFields) {
        $('.error-messages').append('<li>Please fill out all required fields</li>');
      }
    return noBlankFields;
  }

  function validateEmailAddress() {
    var email = emailInput.val();
    var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var valid_email=regex.test(email);
    if(valid_email) {
      emailInput.removeClass("invalid").addClass("valid");
    }
    else {
      emailInput.removeClass("valid").addClass("invalid");
      $('.error-messages').append('<li>Please provide a valid email address</li>');
      validatedEmail = false;
    }
    return valid_email;
  }

  var pastParticipantCheck = $('input[name="entry.351358348"]');

  pastParticipantCheck.change(function() {
    if ($('#group_351358348_1').is(":checked")) {
      var i = requiredFields.indexOf(aboutMeRequiredInput);
      if ( i != -1) {
        requiredFields.splice(i, 1);
      }
      aboutMeRequiredInput.removeAttr('required')
      var label = $('label[for="'+ aboutMeRequiredInput.attr("id") +'"]');
      label.find(".form-field-title").removeClass('field-required');
      noNullFields(requiredFields);
      console.log(requiredFields.length)
    } else if ($('#group_351358348_2').is(":checked")) {
      aboutMeRequiredInput.attr("required", true);
      var label = $('label[for="'+ aboutMeRequiredInput.attr("id") +'"]');
      label.find(".form-field-title").addClass('field-required')
      requiredFields.push(aboutMeRequiredInput);
      console.log(requiredFields.length)
       noNullFields(requiredFields);
    }
  });

  var validated = false;

  $("#form-submit").on("click", function(e) {
    validateForm();
    if (!validated) {
      liveValidateNullFields(requiredFields);
      $('html, body').animate({
        scrollTop: $(".error-messages").offset().top
    }, 200);
      console.log("Form not submitted");
      e.preventDefault();
    } else {
      console.log('Form submitted successfully!');
    }

  });


  function validateForm() {
    $('.error-messages').text("");
      validated = noNullFields(requiredFields) && validateEmailAddress();
  }

  function liveValidateNullFields(requiredFields) {  
    requiredFields.forEach(function(field) {
      field.on("input", function() {
        if (!field.val()) {
          console.log("empty")
          $(this).removeClass("valid").addClass("invalid");
        } else {
          console.log(field.val());
          $(this).removeClass("invalid").addClass("valid");
        }
      })
    })
  }





});