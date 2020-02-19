$(document).ready(function() {
    var div=document.createElement("div"); 
    div.innerHTML ='<div class="mc_embed_signup"><form action="https://mailchimp.us4.list-manage.com/subscribe/post-json?u=815e5f55b60327dbc95cc0f36&amp;id=56c531af63&c=?" method="GET" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate><div id="mc_embed_signup_scroll"><input type="email" value="" placeholder="Email address" name="EMAIL" class="required email" id="mce-EMAIL"><div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_815e5f55b60327dbc95cc0f36_56c531af63" tabindex="-1" value=""></div><div class="clear"><input type="submit" value="Subscribe now" name="subscribe" id="mc-embedded-subscribe" class="button"></div></div></form></div><div class="success-message"><svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="70"><circle class="checkmark-circle" cx="26" cy="26" r="23" fill="none"/><path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/> </svg><div><h4>Success!</h4></div></div>'
    document.body.appendChild(div); 

    var allCookies = document.cookie;
    cookiearray = allCookies.split(';');
    for(var i=0; i<cookiearray.length; i++) {
      name = cookiearray[i].split('=')[0].toString();
      if (name == " emailadd") {
        $(".mc_embed_signup").hide()
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


