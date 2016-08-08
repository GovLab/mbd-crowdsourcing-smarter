$(document).ready(function() {
  console.log("yo");
  $('#form_submit').on("submit", function(e) {
    e.preventDefault();
    console.log(e);
  })
});