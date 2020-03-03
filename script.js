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
          console.log(value)
        }
     }
    }

    var arr = ["Ideation" ,
    "Product creation" ,
    "Product market fit" ,
    "Pricing model" ,
    "Merchandising" ,
    "Build concept & optimize" ,
    "Formalize business" ,
    "Create legal and financials" ,
    "Business process tools" ,
    "Go to market/launch" ,
    "DIY Brand" ,
    "Create logo" ,
    "Get a domain" ,
    "Build a site" ,
    "Create an email" ,
    "Create social content" ,
    "External help" ,
    "Create a look & feel" ,
    "Pick brand palette" ,
    "Create logo" ,
    "Create design system" ,
    "Brand as business priority" ,
    "Refine look and feel" ,
    "Create competitive brand" ,
    "Create online/offline assets" ,
    "In-house brand efforts" ,
    "Build website/page" ,
    "Find customers" ,
    "Understand customers" ,
    "Tag contacts" ,
    "Segment audience" ,
    "Create targeted messaging" ,
    "Tailor channel messaging" ,
    "Create campaign strategy" ,
    "Choose channels and cadence" ,
    "Tailor campaign to the context" ,
    "Make your campaign ownable" ,
    "Create lead gen campaign" ,
    "Create a sales team nurture" ,
    "Observe performance" ,
    "Learn insights" ,
    "Conduct A/B test" ,
    "Analyze results" ,
    "Iterate strategy" ,
    "Re-test" ,
    "Funding options" ,
    "Venture capital" ,
    "Angel investors" ,
    "Bootstrapped (Personal cash/savings)" ,
    "Friends and family (loans, gifts, investors)" ,
    "Traditional bank loan" ,
    "Microloans" ,
    "Welcome automation" ,
    "Import contacts" ,
    "Facebook" ,
    "Email templates" ,
    "Contact support"]

    var intent = arr.map(v => v.toLowerCase());

    $(".fill").autocomplete({
      lookup: intent,
      appendTo: $(".rec"),
      lookupLimit: 5,
      formatResult: function (suggestion, currentValue) {
        return '<li class="h5 margin--right-1 margin--bottom-1" style="border:.0625rem solid #403b3b;"><a style="color: #403b3b; padding: .8375rem 2rem; display: block; font-size: 85%">' + $.Autocomplete.defaults.formatResult(suggestion, currentValue) + '</a></li>'
      }
    });

    // $(".autocomplete-suggestions").removeAttr("style");

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
  });


  const pencilImage = chrome.extension.getURL('resources/images/signup-pencil.png');

  const htmlToRender =

  `
  <div class="layout--margin subscriptionCta backgroundJasmine">
  <div class="mc_embed_signup layout content content--6of8-medium content--8of16-large" style="">
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
        <div class="hf-warning formError" aria-live="polite">Please fill out this field.</div>
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

    <form id="intent" target="_blank" class="form searchBar searchBar--inverted searchOn">
      <input class="searchBar__textInput formInput av-search fill" type="search" name="q" placeholder="Search Mailchimp" autocomplete="off" aria-labelledby="actionable-search-bar-label" style="padding:1.25rem; border: none; box-shadow: none; padding-right: 3.9375reml; margin-bottom: 0px; padding-right:3.9375rem">
      <button type="submit" class="searchBar__submit formSubmit" aria-label="Search Mailchimp">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon--search" aria-label="Search" width="23" height="23" viewBox="0 0 23 23">
          <path fill="#241C15" d="M23 20.978l-6.595-6.531c1.149-1.511 1.838-3.382 1.838-5.415 0-4.98-4.092-9.032-9.121-9.032-5.03 0-9.121 4.052-9.121 9.032s4.092 9.032 9.121 9.032c1.936 0 3.73-.605 5.208-1.628l6.628 6.563 2.042-2.022zm-20.991-11.945c0-3.883 3.191-7.043 7.112-7.043s7.112 3.159 7.112 7.043-3.191 7.043-7.112 7.043-7.112-3.159-7.112-7.043z"></path>
        </svg>
      </button>
    </form>

    <section class="margin--top-2 recommendedSearchQueries searchOn" data-context-text="Try searching for" style="margin-top:3rem">

    <h3 class="microHeading margin--bottom-2" style="font-size: 1rem; font-weight: 500; text-transform: uppercase; margin-bottom: .625rem; position: sticky; left: 0; display: block;">Suggestions</h3>
    <ul class="flex rec" style= "">

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



