$(document).ready( function () {
	var div=document.createElement("div"); 
	div.innerHTML = '<link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css"><style type="text/css">#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; width:100%;}</style><div id="mc_embed_signup"><form action="https://mailchimp.us4.list-manage.com/subscribe/post?u=815e5f55b60327dbc95cc0f36&amp;id=56c531af63" method="POST" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate><div id="mc_embed_signup_scroll"><label for="mce-EMAIL">Want this in your inbox? Sign up below.</label><input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required><div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_815e5f55b60327dbc95cc0f36_56c531af63" tabindex="-1" value=""></div><div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div></div></form></div>'
	document.body.appendChild(div); 

    var $form = $("#mc-embedded-subscribe-form");
	$form.css("color", "red");

    if ( $form.length > 0 ) {
        $('form input[type="submit"]').bind('click', function ( event ) {
            if ( event ) event.preventDefault();
            // validate_input() is a validation function I wrote, you'll have to substitute this with your own.
            register($form);
        });
    }
});

function register($form) {
    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
        data: $form.serialize(),
        cache       : false,
        dataType    : 'json',
        contentType: "application/json; charset=utf-8",
        error       : function(err) { alert("Could not connect to the registration server. Please try again later."); },
        success     : function(data) {
            if (data.result != "success") {
                alert(data.msg);
            } else {
				// It worked, carry on...
				alert(data.msg);
            }
        }
	});
}