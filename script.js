$(document).ready(function() {
    var div=document.createElement("div"); 
    div.innerHTML ='<link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css"><style type="text/css">#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; width:100%;}</style><div class="mc_embed_signup"><form action="https://mailchimp.us4.list-manage.com/subscribe/post-json?u=815e5f55b60327dbc95cc0f36&amp;id=56c531af63&c=?" method="GET" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate><p>hey</p><div id="mc_embed_signup_scroll"><input type="email" value="" placeholder="Email address" name="EMAIL" class="required email" id="mce-EMAIL"><div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_815e5f55b60327dbc95cc0f36_56c531af63" tabindex="-1" value=""></div><div class="clear"><input type="submit" value="Subscribe now" name="subscribe" id="mc-embedded-subscribe" class="button"></div></div></form></div><div class="success-message"><svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="70"><circle class="checkmark-circle" cx="26" cy="26" r="23" fill="none"/><path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/> </svg><div><h4>Success!</h4></div></div>'
    document.body.appendChild(div); 
    var formContainer = $(".mc_embed_signup");
    formContainer.css({ 'color': 'red', 'font-size': '150%' });
    $(".mc_embed_signup > form").submit(function(e) {
      e.preventDefault(); // Prevent a new window from opening upon clicking 'Subscribe now' button
  
      var validForm = true; // Set initial state of valid form to true
      var inputArray = $(this).find("input.required"); // Find all required inputs and store them in array
  
      // Simple check for all inputs to make sure the value is not empty
      inputArray.each(function(item) {
        if ($(this).val() == "") {
          validForm = false;
          $(".mc_embed_signup .error-message").show(); // if empty, show error message
          $('.mc_embed_signup input.required').addClass('error'); // and highlight empty inputs
        }
      });
  
      // Everything checks out! Continue...
      if (validForm == true) {

        var formData = $(this).serialize(); // Format all info and get it ready for sendoff
  
        // AJAX magic coming up...
        $.ajax({
          type: $(this).attr("method"),
          url: $(this).attr("action"),
          data: formData,
          cache: false,
          dataType: "text",
          contentType: "application/json; charset=utf-8",
          encode: true,
          error: function(err) {
            console.log("Uh, oh. There was an error:", err); // You broke something...
          },
          success: function(data) {
            console.log("Success! Here is the data:", data); // Yay!
          }
        }) // All done! Let's show the user a success message:
          .done(function(data) {
            $(formContainer).hide(); // Hide the initial form
  
            $(".success-message").show(); // Show the checkmark
            $("svg").addClass("active"); // Start animation of checkmark
            alert("hi");
          });
      }
  
      return; // No go on form...
    }); // end of submit function
  });

// $(document).ready( function () {
// 	var div=document.createElement("div"); 
//     // div.innerHTML = '<link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css"><style type="text/css">#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; width:100%;}</style><div id="mc_embed_signup"><form action="https://mailchimp.us4.list-manage.com/subscribe//post-json?u=815e5f55b60327dbc95cc0f36&amp;id=56c531af63&c=?" method="POST" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate><div id="mc_embed_signup_scroll"><label for="mce-EMAIL">Want this in your inbox? Sign up below.</label><input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required><div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_815e5f55b60327dbc95cc0f36_56c531af63" tabindex="-1" value=""></div><div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div></div></form></div>'
//     div.innerHTML ='<link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css"><style type="text/css">#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; width:100%;}</style><div class="mc_embed_signup"><form action="https://mailchimp.us4.list-manage.com/subscribe/post-json?u=815e5f55b60327dbc95cc0f36&amp;id=56c531af63&c=?" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate><div id="mc_embed_signup_scroll"><input type="email" value="" placeholder="Email address" name="EMAIL" class="required email" id="mce-EMAIL"><div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_815e5f55b60327dbc95cc0f36_56c531af63" tabindex="-1" value=""></div><div class="clear"><input type="submit" value="Subscribe now" name="subscribe" id="mc-embedded-subscribe" class="button"></div></div></form></div><div class="success-message"><svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="70"><circle class="checkmark-circle" cx="26" cy="26" r="23" fill="none"/><path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/> </svg><div><h4>Success!</h4></div></div>'
// 	document.body.appendChild(div); 

//     var form = $(".mc_embed_signup");
//     var formData = $(this).serialize();


//     $(".mc_embed_signup > form").submit(function(e) {
//         if ( event ) event.preventDefault();
//         // validate_input() is a validation function I wrote, you'll have to substitute this with your own.
//         $.ajax({
//             type: $(this).attr("method"),
//             url: $(this).attr("action"),
//             data: formData,
//             cache: false,
//             dataType: "json",
//             contentType: "application/json; charset=utf-8",
//             encode: true,
//             error: function(err) {
//                 console.log("Uh, oh. There was an error:", err); // You broke something...
//             },
//             success: function(data) {
//                 console.log("Success! Here is the data:", data); // Yay!
//             }
//             })

//     });
//     return;
// });
  

// function register($form) {
//     $.ajax({
//         type: $form.attr('method'),
//         url: $form.attr('action'),
//         data: $form.serialize(),
//         cache       : false,
//         dataType    : 'json',
//         encode: true,
//         contentType: "application/json; charset=utf-8",
//         error       : function(err) { alert("Could not connect to the registration server. Please try again later."); },
//         success     : function(data) {
//             if (data.result != "success") {
//                 alert(data.msg);
//             } else {
// 				// It worked, carry on...
// 				alert(data.msg);
//             }
//         }
// 	});
// }


