
$(document).ready(function() {
  
    var div=document.createElement("div"); 
    div.innerHTML = htmlToRender;
    document.body.appendChild(div); 

    var allCookies = document.cookie;
    cookiearray = allCookies.split(';');
    for(var i=0; i<cookiearray.length; i++) {
      name = cookiearray[i].split('=')[0].toString();
      if (name == " emailadd") {
        // $(".mc_embed_signup").hide()
      }
    }

    const readCookie = () => {
      var allCookies = document.cookie;
      cookiearray = allCookies.split(';');
      for(var i=0; i<cookiearray.length; i++) {
        name = cookiearray[i].split('=')[0].toString();
        value = cookiearray[i].split('=')[1];
        // if (name == " emailadd") {
        //   console.log(value)
        // }
     }
    }

    const writeDate = (days) => {
      var date = new Date();
      date.setTime(+ date + (days * 86400000));
      return date.toGMTString();
    }

    $(".success-message").hide()
    $(".mc_embed_signup > form").submit(function(e) {
      e.preventDefault();

      var val = $( "input[type='email']" ).val();
      var cookievalue = val + ";";
      document.cookie = "emailadd=" + cookievalue + ";expires=" + writeDate(730) + ";";
      readCookie();
      
      var validForm = true;

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
                console.log(d.msg)
                console.log(data.result)
                $("#mc-embedded-subscribe-form").trigger("reset");
            } else {
                console.log(d.msg)
                $(".mc_embed_signup").hide();
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
    <figure class="subscription_container_image">
      <img src="${pencilImage}" alt="Signup Pencil">
    </figure>
    <h2 class="h2 margin">
      Want What's In Store in your inbox? Sign up below.
    </h2>
    <form action="https://mailchimp.us4.list-manage.com/subscribe/post-json?u=815e5f55b60327dbc95cc0f36&amp;id=56c531af63&c=?" method="GET" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
      <div id="mc_embed_signup_scroll">
        <input type="email" value="" placeholder="Email address" name="EMAIL" class="required email" id="mce-EMAIL"><div style="position: absolute; left: -5000px;" aria-hidden="true">
      </div>
      <div class="clear">
        <input type="submit" value="Subscribe now" name="subscribe" id="mc-embedded-subscribe" class="button">
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
  </div>`;


