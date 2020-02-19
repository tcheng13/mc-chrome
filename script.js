
$(document).ready(function() {
  
    var div=document.createElement("div"); 
    div.innerHTML =  htmlToRender;
    document.body.appendChild(div); 
    var formContainer = $(".mc_embed_signup");
    $(".success-message").hide()
    $(".mc_embed_signup > form").submit(function(e) {
      e.preventDefault();
      debugger;
  
      var validForm = true;
      var inputArray = $(this).find("input.required");
  
      inputArray.each(function(item) {
        if ($(this).val() == "") {
          validForm = false;
          $(".mc_embed_signup .error-message").show();
          $('.mc_embed_signup input.required').addClass('error');
        }
      });

      if (validForm == true) {

        var formData = $(this).serialize();
  
        $.ajax({
          type: $(this).attr("method"),
          url: $(this).attr("action"),
          data: formData,
          cache: false,
          dataType: "text",
          contentType: "application/json; charset=utf-8",
          encode: true,
          error: function(err) {
            console.log("Uh, oh. There was an error:", err);
          },
          success: function(data) {
            d = JSON.parse(data.slice(2, -1))
            if (d.result != 'success') {
                alert(d.msg);
                $("#mc-embedded-subscribe-form").trigger("reset");
            } else {
                $(formContainer).hide();
                $(".success-message").show();
                $("svg").addClass("active");
            }
          }
        })

      }
  
      return;
    });
  });

  const pencilImage = chrome.extension.getURL('./pictures/signup-pencil.png');

  const htmlToRender =

  `<div class="mc_embed_signup">
  <div class="layout">
  <figure class="subscription container image">
                    <img src="${pencilImage}" alt="Signup Pencil" style=" border: 1px solid red;">
                </figure>
                <h2 class="h2 margin">
                    Want What's In Store in your inbox? Sign up below.
                </h2>
  <form action="https://mailchimp.us4.list-manage.com/subscribe/post-json?u=815e5f55b60327dbc95cc0f36&amp;id=56c531af63&c=?" method="GET" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate><div id="mc_embed_signup_scroll">

      <input type="email" value="" placeholder="Email address" name="EMAIL" class="required email" id="mce-EMAIL"><div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_815e5f55b60327dbc95cc0f36_56c531af63" tabindex="-1" value="">
          </div>
          <div class="clear"> <input type="submit" value="Subscribe now" name="subscribe" id="mc-embedded-subscribe" class="button">
              </div>
              </div>
              <div class="feedback feedback--success feedback--icon">
              <div class="feedback__content">
              <span>
              Thank you for subscribing!
              <a href="https://mailchimp.us12.list-manage.com/profile?u=9c59d08468a2cd3275953b3f6&id=33043de115&e=2848b82323">
              Click here to manage your preferences</a>
              </span>
              </div>
              </div>
              </form>
              <div class="info">
              <p>
                  Your information will be used to send you Mailchimp updates. 
                  You can change your mind at any time by clicking the unsubscribe 
                  link at the bottom of emails you receive from us. For more details, 
                  review our privacy policy.
                  <a href="/legal/privacy"> privacy policy</a>
              </p>    
              </div>
              <div class="success-message"><svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="70">
                  <circle class="checkmark-circle" cx="26" cy="26" r="23" fill="none"/><path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/> 
                  </svg>
                  <div>
                      <h4>Success!</h4>
                      </div>  
                      </div>
                      </div>`;

