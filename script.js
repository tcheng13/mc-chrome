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
        if (name == " emailadd" || name== " intent") {
          // console.log(value)
        }
     }
    }
    // var intent = getSomething()['suggestions'];

    // function getSomething() {
    //   var result = null;
    //   $.ajax({
    //     async: false,
    //     url: chrome.extension.getURL('resources/json/intents.json'),
    //     dataType: "json",
    //     success: function(data) {
    //       result = data;
    //     }
    //   }
    //   )
    //   return result;
    // }

    const writeDate = (days) => {
      var date = new Date();
      date.setTime(+ date + (days * 86400000));
      return date.toGMTString();
    }

    $(".feedback").hide()
    $(".hf-warning").hide()
    $(".signing").hide()
    // $(".searchOn").hide()

    
    $("#mc-embedded-subscribe-form").submit(function(e) {
      e.preventDefault();

      var val = $( "input[type='email']" ).val();
      var cookievalue = val + ";";
      document.cookie = "email" + cookievalue + ";expires=" + writeDate(730) + ";";
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
                $("input[name='EMAIL']").addClass("hf-validated error")
                $("#mc-embedded-subscribe-form").trigger("reset");
                $(".hf-warning").show()
                $(".feedback").hide()
            } else {
                console.log(d.msg)
                $(".signing").hide();
                $(".searchOn").show();
                $(".hf-warning").hide()
                $("input[name='EMAIL']").removeClass("hf-validated error")
                $("#mc-embedded-subscribe-form").trigger("reset");
            }
          }
        })

      }
  
      return;
    });

    fetch('https://us-central1-mc-intent.cloudfunctions.net/getIntents')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      a = data[1]['item']
    })
    .then(() => {
      suge = $.map(a, function(value, key) { return value });
      $(".fill").autocomplete({
        lookup: suge,
        appendTo: $(".rec"),
        lookupLimit: 5,
        formatResult: function (suggestion, currentValue) {
          return '<li class="h5 margin--right-1 margin--bottom-1" style="border:.0625rem solid #403b3b;"><a style="color: #403b3b; padding: .8375rem 2rem; display: block; font-size: 85%">' + $.Autocomplete.defaults.formatResult(suggestion, currentValue) + '</a></li>'
        }
      });
    })
    .catch( err => {
      return err
    })

    $( "input[name='intent']" ).keypress(()=>{
      $( ".initial" ).hide()
    })


    $('.initial').click(function() {
      name = $(this).attr("name");
      $( "input[name='intent']" ).val('');
      $( "input[name='intent']" ).val(name);
      $( ".initial" ).hide()
    });

    $('#target').click(() =>{
      var val = $( "input[name='intent']" ).val();
      var cookievalue = val + ";";
      document.cookie = "intent=" + cookievalue + ";expires=" + writeDate(730) + ";";
      $( ".searchBar--inverted" ).trigger("reset");

    })
  });


  const pencilImage = chrome.extension.getURL('resources/images/signup-pencil.png');

  const htmlToRender =

  `
  <div class="layout--margin subscriptionCta backgroundJasmine">
  <div class="mc_embed_signup layout content content--6of8-medium content--8of16-large" style="min-height: 20rem">
    <figure class="subscriptionCta__imageContainer image signing">
      <img src="${pencilImage}" alt="Signup Pencil">
    </figure>
    <h2 class="h2 margin--top-6 margin--bottom-4 signing" style="text-align: center">
      Want What's In Store in your inbox? Sign up below.
    </h2>

    <form action="https://mailchimp.us4.list-manage.com/subscribe/post-json?u=815e5f55b60327dbc95cc0f36&amp;id=56c531af63&c=?" method="GET" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate form margin--bottom-2 signing" target="_blank" novalidate>
      <div id="mc_embed_signup_scroll subscriptionCta__fieldset">
        <label class="formLabel subscriptionCta__label" for="subscription-email">Email</label>
        <input type="email" value="" placeholder="freddie@example.com" name="EMAIL" class="required email formInput subscriptionCta__input av-email" id="mce-EMAIL" aria-invalid="true">
        <div class="hf-warning formError" aria-live="polite">Please enter a valid input.</div>
      </div>
      <div class="clear margin--top-2 subscriptionCta__submit">
        <input type="submit" value="Submit" name="subscribe" id="mc-embedded-subscribe" class="ctaPrimary" style="margin: 0 auto; display: block">
      </div>
      <div class="feedback feedback--success feedback--icon">
        <div class="feedback__content">
          <span>
            Thank you for subscribing!
            <a href="https://mailchimp.us12.list-manage.com/profile?u=9c59d08468a2cd3275953b3f6&id=33043de115&e=2848b82323">
            Click here to manage your preferences</a>.
          </span>
        </div>
      </div>
    </form >

    <form class="form searchBar searchBar--inverted searchOn">
      <input name="intent" class="searchBar__textInput formInput av-search fill" placeholder="Search Mailchimp" style="padding:1.25rem; border: none; box-shadow: none; padding-right: 3.9375reml; margin-bottom: 0px; padding-right:3.9375rem">
      <button id="target" type="button" class="searchBar__submit formSubmit" aria-label="Search Mailchimp">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon--search" aria-label="Search" width="23" height="23" viewBox="0 0 23 23">
          <path fill="#241C15" d="M23 20.978l-6.595-6.531c1.149-1.511 1.838-3.382 1.838-5.415 0-4.98-4.092-9.032-9.121-9.032-5.03 0-9.121 4.052-9.121 9.032s4.092 9.032 9.121 9.032c1.936 0 3.73-.605 5.208-1.628l6.628 6.563 2.042-2.022zm-20.991-11.945c0-3.883 3.191-7.043 7.112-7.043s7.112 3.159 7.112 7.043-3.191 7.043-7.112 7.043-7.112-3.159-7.112-7.043z"></path>
        </svg>
      </button>
    </form>

    <section class="margin--top-2 recommendedSearchQueries searchOn" data-context-text="Try searching for" style="margin-top:3rem">

    <h3 class="microHeading margin--bottom-2" style="font-size: 1rem; font-weight: 500; text-transform: uppercase; margin-bottom: .625rem; position: sticky; left: 0; display: block;">Try searching...</h3>
    <ul class="flex rec" style= "">
      <li name="welcome automation" class="h5 margin--right-1 margin--bottom-1 initial" style="border:.0625rem solid #403b3b;">
        <a style="color: #403b3b; padding: .8375rem 2rem; display: block; font-size: 85%">
            welcome automation
        </a>
      </li>
      <li name="import contacts" class="h5 margin--right-1 margin--bottom-1 initial" style="border:.0625rem solid #403b3b;">
          <a style="color: #403b3b; padding: .8375rem 2rem; display: block; font-size: 85%">
              import contacts            
          </a>
      </li>
      <li name="facebook" class="h5 margin--right-1 margin--bottom-1 initial" style="border:.0625rem solid #403b3b;">
          <a style="color: #403b3b; padding: .8375rem 2rem; display: block; font-size: 85%">
              facebook            
          </a>
      </li>
      <li name="email templates" class="h5 margin--right-1 margin--bottom-1 initial" style="border:.0625rem solid #403b3b;">
          <a style="color: #403b3b; padding: .8375rem 2rem; display: block; font-size: 85%">
              email templates            
          </a>
      </li>
      <li name="contact support" class="h5 margin--right-1 margin--bottom-1 initial" style="border:.0625rem solid #403b3b;">
          <a data-behavior="actionableSearchBar:searchQuery" style="color: #403b3b; padding: .8375rem 2rem; display: block; font-size: 85%">
              contact support            
          </a>
      </li>
    </ul>

</section>

    <div class="info signing">
      <p>
          Your information will be used to send you Mailchimp updates. 
          You can change your mind at any time by clicking the unsubscribe 
          link at the bottom of emails you receive from us. For more details, 
          review our 
          <a href="/legal/privacy"> privacy policy</a>.
      </p>    
    </div>
  </div>
  </div>
  `;