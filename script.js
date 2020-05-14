$(document).ready(function() {
    var div=document.createElement("div"); 
    div.innerHTML = htmlToRender;

    const path = window.location.pathname;

    const readCookie = (lookfor) => {
      var allCookies = document.cookie;
      cookiearray = allCookies.split(';');
      for(var i=0; i<cookiearray.length; i++) {
        name = cookiearray[i].split('=')[0].toString();
        value = cookiearray[i].split('=')[1];
        if (name == lookfor) {
          return value
        }
     }
    }

    function swiftSearch(query) {
      $.ajax({
        url: "https://search-api.swiftype.com/api/v1/public/engines/search.json", 
        contentType: "application/json",
        data: {
          "engine_key": "QMWsyDDiWBTV3xZq5EMz",
          "q": query
        },
        success: function(data) {
          $(".searchOn").hide()
          $(".subscriptionCta__imageContainer").hide()
          $(".searchRes").show()
          result = []
          for (i = 0; i < 6; i++) {
            result.push([data.records.page[i].title, data.records.page[i].description, data.records.page[i].url])
            if (data.records.page[i].description.split(' ').length > 14) {
              desc = data.records.page[i].description.split(' ').slice(0, 14).join(' ') + "...";
            } else {
              desc = data.records.page[i].description;
            }
            idMap = {1:"one", 2:"two", 3:"three", 4:"four", 5:"five", 6:"six"},
            $(".searchRes").append(
              `<div class="searchRes__content">
                <h2 class="h5">
                    <a id=${idMap[i]} class="link">${data.records.page[i].title}</a>
                </h2>
                <p class="copy">${desc}</p>
              </div>`
              )
            $("#" + idMap[i]).attr("href", data.records.page[i].url);
  
          }
  
          console.log(result)
  
        }
      });
    };

    const getIntents = () =>{
      return fetch('https://us-central1-mc-intent.cloudfunctions.net/getIntents')
      .then((response) => {
        return response.json();
      })
    }

    if (path in urlLookUp) {
      var eID = readCookie(" email");
      console.log(eID);
      console.log(path);
      getIntents()
      .then((data) => {
        let id;
        for (var key in data[0]) {
          if (data[0][key].email == eID) {
            id = key
          }
        }
        postData('https://us-central1-mc-intent.cloudfunctions.net/addUrl?id=' + id, {path: path})
        console.log(id)
      })
    }

    $( div ).insertBefore(".globalFooter");
    var allCookies = document.cookie;

    const writeDate = (days) => {
      var date = new Date();
      date.setTime(+ date + (days * 86400000));
      return date.toGMTString();
    }

    $(".feedback").hide()
    $(".hf-warning").hide()
    // $(".signing").hide()
    $(".searchOn").hide()
    $(".searchRes").hide()
    // $(".subscriptionCta__imageContainer").hide()

    cookiearray = allCookies.split(';');

    for(var i=0; i<cookiearray.length; i++) {
      name = cookiearray[i].split('=')[0].toString();
      if (name == " email") {
        $(".signing").hide()
        $(".subscriptionCta__imageContainer").hide()
        const value = cookiearray[i].split('=')[1];
        getIntents()
        .then((data) => {
          let url;
          for (var key in data[0]) {
            if (data[0][key].email == eID) {
              for (var val in data[0][key].url) {
                url = data[0][key].url[val]
              }
            }
          }
          const intents = urlLookUp[url];
          let res = '';
          for (i = 0; i < intents.length; i++) {
            res += intentToTopic[intents[i]]
          }
          console.log(intents);
          swiftSearch(res);
          $(".searchRes").show();
        })
      }
    }

    
    $("#mc-embedded-subscribe-form").submit(function(e) {
      e.preventDefault();

      var val = $( "input[type='email']" ).val();
      var cookievalue = val + ";";
      document.cookie = "email=" + cookievalue + ";expires=" + writeDate(730) + ";";

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

    let items;

    fetch('https://us-central1-mc-intent.cloudfunctions.net/getIntents')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      items = data
      a = data[data.length - 2]
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

    async function postData(url = '', data = {}) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => {
        return response.json()
      })
    }

    $( "input[name='intent']" ).keypress(()=>{
      $( ".initial" ).hide()
      $( "#try").css("visibility", "hidden");
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
      var eID = readCookie(" email");
      document.cookie = "intent=" + cookievalue + ";expires=" + writeDate(730) + ";";
      $( ".searchBar--inverted" ).trigger("reset");

      postData('https://us-central1-mc-intent.cloudfunctions.net/addEmail', { email: eID, intent: val })
      .then((data) => {
        console.log(data);
      });

      swiftSearch(val);
    });

    // $.ajax({
    //   url: "https://search-api.swiftype.com/api/v1/public/engines/search.json", 
    //   contentType: "application/json",
    //   data: {
    //     "engine_key": "QMWsyDDiWBTV3xZq5EMz",
    //     "q": "Create"
    //   },
    //   success: function(data) {
    //     $(".searchRes").show()
    //     $(".searchOn").hide()
    //     $(".subscriptionCta__imageContainer").hide()
    //     result = []
    //     for (i = 0; i < 6; i++) {
    //       result.push([data.records.page[i].title, data.records.page[i].description, data.records.page[i].url])
    //       if (data.records.page[i].description.split(' ').length > 14) {
    //         desc = data.records.page[i].description.split(' ').slice(0, 14).join(' ') + "...";
    //       } else {
    //         desc = data.records.page[i].description;
    //       }
    //       idMap = {1:"one", 2:"two", 3:"three", 4:"four", 5:"five", 6:"six"},
    //       $(".searchRes").append(
    //         `<div class="searchRes__content">
    //           <h2 class="h5">
    //               <a id=${idMap[i]} class="link">${data.records.page[i].title}</a>
    //           </h2>
    //           <p class="copy">${desc}</p>
    //         </div>`
    //         )
    //       $("#" + idMap[i]).attr("href", data.records.page[i].url);

    //     }

    //     console.log(result)

    //   }
    // });

    const back = () => {
      $(".searchOn").show()
      $(".subscriptionCta__imageContainer").show()
      $(".searchRes").hide()
      $(".searchRes__content").remove();

    }

    $('#back').on('click', back);

  });


  const pencilImage = chrome.extension.getURL('resources/images/signup-pencil.png');

  const htmlToRender =

  `
  <div class="layout--margin subscriptionCta backgroundJasmine">
  <div class="mc_embed_signup layout content content--8of8-medium content--10of16-large" id="whole">
    <figure class="subscriptionCta__imageContainer image">
      <img src="${pencilImage}" alt="Signup Pencil">
    </figure>
    <h2 class="h2 margin--top-6 margin--bottom-4 signing" style="text-align: center; font-size: 2.8rem">
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

    <h3 id="try" class="microHeading margin--bottom-2" style="font-size: 1rem; font-weight: 500; text-transform: uppercase; margin-bottom: .625rem; position: sticky; left: 0; display: block;">Try searching for</h3>
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

<div class="searchRes">
<button id="back">&#8592; Intent Selection</button>
</div>



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

  const urlLookUp = {'/4-steps-use-audience-data-to-drive-engagement/': ['Build + Collect: Understand customers',
  'Optimize: Learn insights',
  'Optimize: Iterate strategy'],
 '/4-steps-use-customer-data-to-sell-more-stuff/': ['Build + Collect: Understand customers',
  'Optimize: Learn insights',
  'Optimize: Iterate strategy'],
 '/clv/': ['Build + Collect: Understand customers',
  'Optimize: Analyze results',
  'Personalize: Tailor channel messaging'],
 '/culture/a-look-at-the-motherships-first-year/': ['Build + Collect: Understand customers',
  'Optimize: Iterate strategy',
  'Optimize: Analyze results'],
 '/culture/how-we-encourage-side-hustles/': ['Build + Collect: Understand customers',
  'Ethan: Create social content',
  'Danielle: Refine look and feel'],
 '/culture/showcasing-mailchimp-customers-through-our-sponsorships/': ['Build + Collect: Understand customers',
  'Personalize: Create targeted messaging'],
 '/marketing-glossary/crm/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Personalize: Tailor channel messaging'],
 '/marketing-glossary/display-ads/': ['Build + Collect: Understand customers',
  'Sophie: Create a look & feel',
  'Danielle: Refine look and feel'],
 '/marketing-glossary/google-my-business/': ['Build + Collect: Build website/page'],
 '/marketing-glossary/google-remarketing/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Ethan: Create an email'],
 '/marketing-glossary/marketing-automation/': ['Build + Collect: Understand customers',
  'Build + Collect: Find customers',
  'Organize: Segment audience'],
 '/marketing-glossary/seo/': ['Build + Collect: Build website/page',
  'Sophie: Create a look & feel',
  'Danielle: Refine look and feel'],
 '/partners/achieve-empathetic-automation/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Personalize: Tailor channel messaging'],
 '/partners/case-study-automation/': ['Build + Collect: Understand customers',
  'Ethan: Create social content',
  'Optimize: Conduct A/B test'],
 '/partners/cellar-cyberspace-delicate-balance-boutique-brand/': ['Build + Collect: Build website/page',
  'Build + Collect: Understand customers',
  'Organize: Segment audience'],
 '/partners/deliverability-for-your-clients/': ['Build + Collect: Find customers',
  'Personalize: Tailor channel messaging',
  'Optimize: Conduct A/B test'],
 '/partners/fix-broken-newsletter/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Personalize: Tailor channel messaging'],
 '/partners/freelancing-like-a-pro/': ['Build + Collect: Find customers',
  'Market: Create lead gen campaign',
  'Community: Professional'],
 '/partners/giving-the-gift-of-data/': ['Build + Collect: Find customers',
  'Optimize: Analyze results',
  'Optimize: Iterate strategy'],
 '/partners/how-mailchimp-does-deliverability/': ['Build + Collect: Understand customers',
  'Danielle: Refine look and feel',
  'Personalize: Tailor channel messaging'],
 '/partners/how-to-be-an-elite-email-marketer/': ['Build + Collect: Understand customers',
  'Build + Collect: Find customers'],
 '/partners/issue-05-automating-potential-leads/': ['Build + Collect: Understand customers',
  'Scaling: Invest in technology',
  'Tech: Manage complexity'],
 '/partners/strategic-design-with-rhyme-and-reason/': ['Build + Collect: Understand customers',
  'Startup: Ideation',
  'Market: Create campaign strategy'],
 '/partners/win-brand-vs-retailer-war/': ['Build + Collect: Understand customers',
  'Danielle: Refine look and feel',
  'Optimize: Analyze results'],
 '/resources/4-ways-to-capture-an-audience-for-your-holiday-marketing/': ['Build + Collect: Find customers',
  'Build + Collect: Understand customers',
  'Personalize: Create targeted messaging'],
 '/resources/accessibility-in-email-marketing/': ['Build + Collect: Understand customers',
  'Ethan: Create an email',
  'Danielle: Refine look and feel'],
 '/resources/beginners-guide-to-segmentation/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Personalize: Create targeted messaging'],
 '/resources/blogging-for-local-search-results/': ['Build + Collect: Find customers',
  'Build + Collect: Understand customers',
  'Market: Make your campaign ownable'],
 '/resources/boost-your-business-with-landing-pages/': ['Build + Collect: Build website/page',
  'Organize: Segment audience',
  'Ethan: Create social content'],
 '/resources/connect-with-customers-on-valentines-day/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Personalize: Tailor channel messaging'],
 '/resources/does-the-perfect-email-template-exist-we-used-data-to-find-out/': ['Build + Collect: Understand customers',
  'Ethan: Create an email',
  'Optimize: Iterate strategy'],
 '/resources/early-holiday-marketing-tips/': ['Build + Collect: Find customers',
  'Organize: Segment audience',
  'Optimize: Analyze results'],
 '/resources/fresh-new-pop-up-forms-to-grow-your-list/': ['Build + Collect: Understand customers',
  'Build + Collect: Find customers',
  'Organize: Segment audience'],
 '/resources/from-empathy-to-loyalty-connecting-with-customers/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Personalize: Tailor channel messaging'],
 '/resources/growing-your-list-with-giveaways/': ['Build + Collect: Find customers',
  'Market: Choose channels and cadence',
  'Ethan: Create social content'],
 '/resources/harnessing-multichannel-marketing/': ['Build + Collect: Find customers',
  'Ethan: Create social content',
  'Optimize: Analyze results'],
 '/resources/how-artiphon-grew-its-audience-with-kickstarter-and-email/': ['Build + Collect: Find customers',
  'Organize: Segment audience',
  'Ethan: Create social content'],
 '/resources/how-automation-helped-little-green-dot-grow/': ['Build + Collect: Understand customers',
  'Danielle: Refine look and feel',
  'Market: Choose channels and cadence'],
 '/resources/how-blink-built-its-business-with-email-automation/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Danielle: Refine look and feel'],
 '/resources/how-fountain-pen-revolution-gets-repeat-customers-with-facebook-ads/': ['Build + Collect: Understand customers'],
 '/resources/how-mailchimp-automation-helps-buffer-educate-2-5-million-users/': ['Build + Collect: Find customers',
  'Tools: Sophistication increases',
  'Market: Create lead gen campaign'],
 '/resources/how-one-apparel-company-wins-customer-loyalty-with-order-notifications/': ['Build + Collect: Understand customers',
  'Ethan: Create an email',
  'Optimize: Iterate strategy'],
 '/resources/how-stringjoy-built-their-giant-instagram-following-from-scratch/': ['Build + Collect: Understand customers',
  'Ethan: Create social content',
  'Danielle: Refine look and feel'],
 '/resources/how-the-onion-turns-funny-headlines-into-great-emails/': ['Build + Collect: Understand customers',
  'Ethan: Create an email',
  'Ethan: Create social content'],
 '/resources/how-to-build-your-email-list/': ['Build + Collect: Find customers',
  'Build + Collect: Understand customers',
  'Build + Collect: Import contact'],
 '/resources/how-to-design-sign-up-forms-that-work/': ['Build + Collect: Build website/page',
  'Build + Collect: Understand customers',
  'Optimize: Analyze results'],
 '/resources/increase-conversion-rate-from-ad-to-landing-page/': ['Build + Collect: Understand customers',
  'Optimize: Conduct A/B test',
  'Optimize: Analyze results'],
 '/resources/introducing-a-new-and-improved-campaign-builder/': ['Build + Collect: Understand customers',
  'Optimize: Learn insights',
  'Optimize: Iterate strategy'],
 '/resources/issue-34-talking-customers/': ['Build + Collect: Understand customers',
  'Optimize: Learn insights',
  'Maintain: Customer research'],
 '/resources/issue-45-featuring-lumi/': ['Build + Collect: Understand customers',
  'Startup: Build concept & optimize',
  'Tools: Find efficiency at scale'],
 '/resources/make-lasting-connections-with-welcome-emails/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Optimize: Analyze results'],
 '/resources/our-favorite-holiday-recipes/': ['Build + Collect: Build website/page',
  'Organize: Segment audience',
  'Ethan: Create an email'],
 '/resources/pop-up-form-copywriting/': ['Build + Collect: Build website/page',
  'Build + Collect: Understand customers',
  'Sophie: Create a look & feel'],
 '/resources/research-market-demand/': ['Build + Collect: Understand customers',
  'Organize: Segment audience',
  'Optimize: Learn insights'],
 '/resources/targeting-better-with-tags/': ['Build + Collect: Understand customers',
  'Optimize: Learn insights',
  'Market: Tailor campaign to the context'],
 '/resources/use-behavioral-targeting-and-tags-for-segmentation/': ['Build + Collect: Understand customers',
  'Scaling: Invest in technology',
  'Personalize: Create targeted messaging'],
 '/resources/using-product-recommendations-to-earn-more-revenue/': ['Build + Collect: Understand customers',
  'Personalize: Tailor channel messaging',
  'Optimize: Analyze results'],
 '/resources/using-the-customer-journey-to-guide-your-campaigns/': ['Build + Collect: Understand customers',
  'Personalize: Create targeted messaging',
  'Market: Create campaign strategy'],
 '/resources/what-are-local-search-citations/': ['Build + Collect: Build website/page'],
 '/resources/what-is-local-seo/': ['Build + Collect: Build website/page'],
 '/resources/what-makes-a-good-permission-reminder/': ['Build + Collect: Understand customers',
  'Personalize: Create targeted messaging',
  'Optimize: Iterate strategy'],
 '/resources/why-you-need-customer-reviews-and-the-best-ways-to-get-them/': ['Build + Collect: Understand customers',
  'Market: Create lead gen campaign']};

  const intentToTopic = {'Build + Collect: Build website/page': 'websites, landing pages, business administration, holidays, growing your audience, growth strategies, e-commerce, search enginge optimization, financial services, sales strategies, social media, expert advice, copywriting, user experience, contests & giveaways, experimentation, branding, conversion rate optimization',
  'Build + Collect: Find customers': 'starting a business, mental health, growing your audience, customer relationship management, blogging, content marketing, search enginge optimization, marketing automation, social media, growth strategies, b2c marketing, networks, brand building, email marketing, analytics, business management, gig economy, advertising, conversion rate optimization, integrated marketing, direct mail, e-commerce, selling, personalization, websites, holidays, campaign ideas, contests & giveaways, shop, compliance, spam, branding,  ',
  'Build + Collect: Import contact': 'email marketing, advertising, websites, growing your audience',
  'Build + Collect: Understand customers': "expert advice, branding, creative inspiration, e-commerce, starting a business, social media, email marketing, spam, lessons learned, blogging, personalization, influencer marketing, creativity's value, content marketing, websites, marketing automation, research, growth strategies, brand building, search enginge optimization, workers, double opt-in, google ads, advertising, partners, apps & integrations, customer relationship management, api, time management, growing your audience, business administration, sales strategies, b2b marketing, b2c marketing, direct mail, consumer trends, customer retention, retail marketing, analytics, business management, conversion rate optimization, integrated marketing, experimentation, customer service, selling, mobile marketing, accessibility, design, promo codes & discounts, user experience, campaign ideas, landing pages, holidays, business ideas, self , subject lines, copywriting, hiring an agency, shop, contests & giveaways, lead generation, business models, compliance, productivity, supply chain, shipping & fulfillment, trends, marketing trends, survey, c2c marketing, photography, eat & drink,  ",
  'Community: Build social network': "websites, landing pages, business administration, social media, growth strategies, b2b marketing, expert advice, brand building, b2c marketing, creativity's value, creative inspiration, life, growing your audience, branding, search enginge optimization, compliance, content marketing, advertising, e-commerce, holidays, mobile marketing, time management, marketing automation, email marketing, campaign ideas, workers, design, partners, influencer marketing, selling,  , art",
  'Community: Cohorts': 'workers, life, business management, people management, art, productivity, mental health, support, workspace, branding',
  'Community: Physical spaces': ' , customer retention, promo codes & discounts, customer service, campaign ideas, personalization, life, e-commerce, workspace, workers, design, art, industrial design',
  'Community: Professional': "blogging, branding, workers, social media, growth strategies, b2b marketing, expert advice, brand building, email marketing, business management, gig economy, life, marketing automation, business ideas, partners, e-commerce, workspace, people management, design, art, mentor, human resources, influencer marketing, b2c marketing, creative inspiration, creativity's value, advertising, campaign ideas",
  'Community: Word of mouth': 'websites, content marketing, search enginge optimization, brand building, growth strategies, networks, starting a business, customer relationship management, marketing automation, branding, social media, analytics, influencer marketing, business administration, c2c marketing, sales strategies, e-commerce, business ideas, sustainability ',
  'Danielle: Brand as business priority': "brand building, branding, life, starting a business, partners, email marketing, customer retention, marketing automation, business management, workers, content marketing, expert advice, e-commerce, integrated marketing, people management, productivity, time management, business models, creative inspiration, design, websites, advertising, google ads, landing pages, apps & integrations, b2c marketing, sales strategies, selling, contests & giveaways, creativity's value, art, campaign ideas, photography,  ",
  'Danielle: Create competitive brand': 'brand building, growth strategies, networks, content marketing, starting a business, branding, copywriting, email marketing, promo codes & discounts, retail marketing, e-commerce, selling, advertising, google ads, analytics, apps & integrations, search enginge optimization',
  'Danielle: Create online/offline assets': "branding, creative inspiration, creativity's value, influencer marketing, business administration, c2c marketing, sales strategies, e-commerce",
  'Danielle: In-house brand efforts': 'branding, brand building, starting a business, experimentation, e-commerce, copywriting, content marketing, advertising, google ads, email marketing, campaign ideas, mobile marketing, marketing automation,  , b2c marketing, merchandising',
  'Danielle: Refine look and feel': "e-commerce, starting a business, social media, campaign ideas, content marketing, brand building, blogging, design, customer relationship management, workers, branding, partners, marketing automation, email marketing, search enginge optimization, analytics, growing your audience, advertising, websites, business management, apps & integrations, google ads, photography, business ideas, holidays, integrated marketing, experimentation, sales strategies, mobile marketing, copywriting, customer service, accessibility, landing pages, growth strategies, personalization, art, user experience, content management, customer retention, b2c marketing, hiring an agency, retail marketing, conversion rate optimization, selling, business models, compliance, expert advice, contests & giveaways, merchandising, demand generation,  , creative inspiration, subscribe, creativity's value",
  'Ethan: Build a site': 'search enginge optimization, analytics, growing your audience, websites, business management, email marketing, customer relationship management, marketing automation, e-commerce, partners, customer retention, branding, starting a business, design, landing pages, apps & integrations, mobile marketing, business ideas, campaign ideas, content marketing',
  'Ethan: Create an email': "email marketing, expert advice, spam, lessons learned, blogging, holidays, customer retention, customer relationship management, search enginge optimization, social media, content marketing, growing your audience, growth strategies, life, google ads, advertising, marketing automation, e-commerce, retail marketing, personalization, apps & integrations, business ideas, integrated marketing, sales strategies, customer service, design, business administration, brand building, accessibility, websites, research, user experience, starting a business, conversion rate optimization, selling, double opt-in, campaign ideas, content management, subject lines, copywriting, experimentation, gdpr, direct mail, marketing trends, landing pages, analytics, b2c marketing, eat & drink,  , subscribe, creativity's value",
  'Ethan: Create logo': 'b2c marketing, design, branding, brand building,  , creative inspiration, retail marketing, e-commerce',
  'Ethan: Create social content': "workers, e-commerce, social media, growth strategies, b2b marketing, expert advice, brand building, b2c marketing, networks, marketing trends, funding, advertising, trends, campaign ideas, growing your audience, content marketing, mobile marketing, analytics, email marketing, holidays, marketing automation, integrated marketing, shop, branding, video marketing, subject lines, personalization, customer service, landing pages, business ideas, self , productivity, time management, business management, customer retention, contests & giveaways, sales strategies, customer relationship management, creative inspiration, creativity's value, copywriting, influencer marketing, selling,  , photography, retail marketing, search enginge optimization, experimentation, subscribe",
  'Ethan: DIY Brand': 'branding, creative inspiration, retail marketing, design, e-commerce, business ideas, campaign ideas, starting a business, workspace, advertising, brand building, photography, art',
  'Ethan: Get a domain': 'websites, landing pages, business administration, marketing automation',
  'Financials: DIY': 'workers, human resources, apps & integrations, finances, business management, business administration,  ',
  'Financials: Expert help': 'business management, business administration,  ',
  'Financials: In-house': 'starting a business, business management, branding, apps & integrations, finances, business administration,  ',
  'Funding: Research funding options': 'marketing trends, funding, advertising, trends, campaign ideas',
  'Funding: Write your business plan': 'e-commerce, retail marketing',
  'Legal: DIY': 'double opt-in, gdpr, direct mail, email marketing, expert advice, growing your audience, b2c marketing',
  'Legal: Expert help': 'business administration, business management, gdpr, growing your audience, email marketing, b2c marketing',
  'Legal: In-house': 'double opt-in, gdpr, expert advice, growing your audience, email marketing, b2c marketing',
  'Maintain: Customer research': 'email marketing, expert advice, spam, lessons learned, blogging, customer retention, apps & integrations, holidays, business ideas, self , consumer trends, trends, marketing trends, research, survey',
  'Maintain: New product needs': 'apps & integrations',
  'Maintain: Product iterations': 'design, websites, eat & drink, landing pages, b2c marketing, e-commerce, sales strategies, business ideas, experimentation, retail marketing, starting a business, business models, brand building, branding, sustainability ',
  'Market: Choose channels and cadence': 'direct mail, growing your audience, branding, brand building, marketing automation, social media, growth strategies, b2b marketing, b2c marketing, networks, content marketing, mobile marketing, advertising, email marketing, integrated marketing, e-commerce, personalization, business management, retail marketing, video marketing, productivity, google ads, holidays, campaign ideas, business models, creative inspiration, contests & giveaways, customer retention, user experience, landing pages, selling, sales strategies,  , shop, analytics',
  'Market: Create campaign strategy': "holidays, sales strategies, e-commerce, apps & integrations, social media, promo codes & discounts, landing pages, direct mail, design, personalization, search enginge optimization, content marketing, blogging, copywriting, brand building, growing your audience, branding, websites, retail marketing, email marketing, expert advice, b2c marketing, integrated marketing, partners, marketing automation, advertising, life, b2b marketing, financial services, video marketing, productivity, google ads, subject lines, experimentation, mobile marketing, customer retention, time management, conversion rate optimization, analytics, customer relationship management, growth strategies, campaign ideas, art, merchandising,  , demand generation, influencer marketing, eat & drink, business ideas, starting a business, sustainability , shop, creative inspiration, creativity's value",
  'Market: Create lead gen campaign': 'email marketing, business management, growth strategies, gig economy, marketing automation, search enginge optimization, conversion rate optimization, e-commerce, selling, research, b2c marketing, social media, campaign ideas',
  'Market: Make your campaign ownable': "brand building, branding, direct mail, growing your audience, blogging, content marketing, search enginge optimization, retail marketing, integrated marketing, b2b marketing, b2c marketing, customer relationship management, productivity, marketing automation, email marketing, design, research, selling, user experience, social media, e-commerce, creative inspiration, creativity's value, advertising, art, campaign ideas, holidays, shop",
  'Market: Tailor campaign to the context': 'customer retention, promo codes & discounts, customer service, campaign ideas, brand building, personalization, content marketing, growing your audience, websites, search enginge optimization, blogging, social media, email marketing, retail marketing, expert advice, partners, growth strategies, advertising, direct mail, branding, survey, marketing automation, e-commerce, design, research, conversion rate optimization, selling, experimentation, holidays, art, user experience, content management, copywriting, sales strategies, creative inspiration, productivity, customer relationship management,  , b2c marketing, mobile marketing, business ideas',
  'Optimize: Analyze results': 'expert advice, branding, creative inspiration, campaign ideas, content marketing, brand building, search enginge optimization, social media, blogging, copywriting, growing your audience, websites, marketing automation, analytics, email marketing, mobile marketing, b2c marketing, api, customer relationship management, time management, advertising, conversion rate optimization, consumer trends, business administration, customer retention, landing pages, growth strategies, experimentation, personalization, e-commerce, business management, retail marketing, integrated marketing, google ads, survey, design, research, workspace, life, accessibility, selling, sales strategies, apps & integrations, hiring an agency, workers, holidays, promo codes & discounts, user experience, influencer marketing,  , merchandising, photography',
  'Optimize: Conduct A/B test': 'search enginge optimization, social media, content marketing, blogging, analytics, landing pages, advertising, growth strategies, experimentation, email marketing, business ideas, survey, e-commerce, holidays, conversion rate optimization, sales strategies, marketing automation, personalization, compliance, spam, growing your audience, b2c marketing, selling,  ',
  'Optimize: Iterate strategy': "campaign ideas, content marketing, brand building, personalization, influencer marketing, creativity's value, search enginge optimization, social media, blogging, copywriting, growing your audience, websites, customer relationship management, starting a business, mental health, productivity, time management, spam, analytics, business administration, sales strategies, b2b marketing, b2c marketing, growth strategies, customer retention, hiring an agency, conversion rate optimization, experimentation, marketing automation, email marketing, business ideas, advertising, google ads, photography, design, branding, research, selling, apps & integrations, holidays, e-commerce, workers, direct mail, merchandising,  ",
  'Optimize: Learn insights': 'customer retention, brand building, customer service, holidays, customer relationship management, search enginge optimization, content marketing, websites, blogging, research, starting a business, growth strategies, branding, email marketing, expert advice, partners, conversion rate optimization, experimentation, growing your audience, analytics, campaign ideas, selling, marketing automation, b2c marketing, apps & integrations, time management, spam, e-commerce, mobile marketing, advertising, art,  , design, consumer trends, trends, marketing trends, survey',
  'Optimize: Observe performance': 'consumer trends, demand generation, brand building, branding, personalization, e-commerce, business management, retail marketing, email marketing, selling, b2c marketing, analytics, experimentation, design, industrial design, growing your audience, mobile marketing, holidays,  ',
  'Optimize: Re-test': 'e-commerce, retail marketing, experimentation, email marketing, subject lines, marketing automation, analytics, design, b2c marketing, growing your audience, selling,  ',
  'Organize: Segment audience': 'starting a business, search enginge optimization, content marketing, websites, blogging, customer relationship management, holidays, growing your audience, growth strategies, research, marketing automation, email marketing, analytics, e-commerce, personalization, google ads, advertising, api, time management, business administration, sales strategies, b2b marketing, b2c marketing, conversion rate optimization, landing pages, customer retention, shop, direct mail, subject lines, experimentation, selling, social media, design, brand building, accessibility, promo codes & discounts, campaign ideas, copywriting, customer service, retail marketing, creative inspiration,  , business ideas, photography, eat & drink, expert advice',
  'Personalize: Create targeted messaging': "personalization, influencer marketing, creativity's value, content marketing, holidays, customer retention, customer relationship management, direct mail, design, starting a business, search enginge optimization, websites, social media, blogging, branding, brand building, growth strategies, networks, email marketing, analytics, creative inspiration, life, apps & integrations, e-commerce, business ideas, shop, experimentation, sales strategies, marketing automation, mobile marketing, growing your audience, copywriting, hiring an agency, campaign ideas, gdpr, expert advice, retail marketing, landing pages, advertising",
  'Personalize: Tailor channel messaging': 'life, email marketing, personalization, brand building, content marketing, branding, starting a business, expert advice, b2c marketing, integrated marketing, growing your audience, advertising, consumer trends, business administration, customer retention, customer relationship management, analytics, social media, marketing automation, customer service, e-commerce, conversion rate optimization, promo codes & discounts, design, growth strategies, selling, research, double opt-in, sales strategies, websites, google ads, subject lines, copywriting, business models, creative inspiration, holidays, campaign ideas, compliance, spam, business management, mobile marketing, business ideas',
  'Scaling: Find employees': 'blogging, branding, life, human resources, workers, support',
  'Scaling: Growth hacking': 'e-commerce, branding, workers, creative inspiration, lessons learned',
  'Scaling: Invest in technology': 'consumer trends, demand generation, expert advice, branding, creative inspiration, api, design, customer service, social media, e-commerce, marketing trends, funding, advertising, trends, campaign ideas, apps & integrations, customer relationship management, marketing automation, search enginge optimization, business management, websites, financial services, holidays, sales strategies, integrated marketing, email marketing, growth strategies, starting a business, deep work, lessons learned, partners, productivity, time management, finances, double opt-in, shop, selling, contests & giveaways, lead generation, growing your audience, analytics, b2c marketing, mobile marketing, google ads,  ',
  'Scaling: Plan ': 'customer service, social media, e-commerce, partners, starting a business, business management, deep work, lessons learned, design, industrial design',
  'Sophie: Create a look & feel': 'consumer trends, demand generation, direct mail, design, personalization, content marketing, blogging, customer relationship management, branding, brand building, starting a business, expert advice, b2c marketing, integrated marketing, analytics, email marketing, websites, advertising, social media, search enginge optimization, business management, google ads, photography, experimentation, growing your audience, e-commerce, marketing automation, business administration, apps & integrations, customer service, customer retention, growth strategies, double opt-in, art, user experience, mobile marketing, campaign ideas, copywriting, contests & giveaways, landing pages, selling,  , sales strategies, holidays, retail marketing, merchandising, creative inspiration',
  'Sophie: Pick brand palette': 'b2c marketing,  ',
  'Startup: Build concept & optimize': 'productivity, time management, marketing automation, sales strategies, e-commerce, email marketing, life, workers, people management, hiring an agency, branding, selling, b2c marketing,  , supply chain, shipping & fulfillment, holidays, campaign ideas',
  'Startup: Business process tools': 'customer retention, promo codes & discounts, customer service, campaign ideas, personalization, branding, business management, marketing automation, selling',
  'Startup: Claim business name': 'business administration, business management, websites, marketing automation, branding, business ideas, creative inspiration, starting a business, workspace, e-commerce',
  'Startup: Create legal and financials': 'starting a business, business management, branding',
  'Startup: Formalize business': 'business administration, business management, starting a business, branding, e-commerce, analytics, apps & integrations, search enginge optimization, business ideas, creative inspiration, workspace, campaign ideas',
  'Startup: Go to market/launch': 'starting a business, mental health, growing your audience, customer relationship management, e-commerce, brand building, business management, selling, b2c marketing, marketing automation, email marketing, creative inspiration, branding, productivity, social media, analytics, business ideas, growth strategies, influencer marketing',
  'Startup: Ideation': 'customer retention, brand building, customer service, websites, e-commerce, business management, expert advice, integrated marketing, starting a business, selling, b2c marketing, design, growth strategies, branding, business ideas, creative inspiration, workspace, campaign ideas',
  'Startup: Merchandising': 'e-commerce, starting a business, social media, personalization, partners, customer retention, direct mail, sales strategies, marketing automation, business ideas, growth strategies, branding, selling, b2c marketing,  , campaign ideas, customer service, photography, retail marketing, eat & drink, landing pages, websites, advertising',
  'Startup: Product creation': 'e-commerce, branding, holidays, starting a business, brand building, selling, b2c marketing, analytics, apps & integrations, search enginge optimization, creative inspiration, retail marketing, design, business ideas, experimentation, business models',
  'Startup: Product market fit': 'marketing automation, customer retention, business ideas, experimentation, retail marketing, starting a business, business models',
  'Team: Who to hire when': 'blogging, branding, partners, starting a business, business management, workers, growth strategies, b2b marketing, business administration, customer retention, hiring an agency, life, human resources, apps & integrations, support',
  'Tech: Manage complexity': 'customer relationship management, marketing automation, expert advice, lead generation, sales strategies, email marketing, research',
  'Tools: Find efficiency at scale': 'customer service, social media, e-commerce, supply chain, b2c marketing, shipping & fulfillment',
  'Tools: Sophistication increases': 'b2c marketing, growth strategies, social media, analytics, email marketing, e-commerce, marketing automation'}

