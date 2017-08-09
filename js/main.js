$(document).ready(function(){
	    $("#is_mobile").val(isMobile() ? 'mobile' : 'desktop');
    $(window).resize(function () {
        $("#is_mobile").val(isMobile() ? 'mobile' : 'desktop');
    });
	var qp = getQueryParams();
	$("#tool").val(qp.ToolName);
    $("#site").val(qp.site);
	
	//click to call event
	    $("#call-now").click(function () {
        dataLayer.push({
            'Category': 'Minisite',
            'Action': 'C2C',
            'Label': 'Mobile',
            'event': 'auto_event'
        });
    });

	function mobile_open() {
		var now = new Date($('#servertime').val());
		var today = now.getDay();
		var hourNow = now.getHours();

		if (today === 6) return false;
		if (today === 5 && hourNow >= 13) return false;
		if (hourNow < 8 || hourNow >= 17) return false;
		return true;
	}
    if (!mobile_open()) {
        $(".call-now.mobile").css('visibility', 'hidden');
    }

	function isMobile() {
		return $(window).innerWidth() <= 1000;
	}

	function getQueryParams() {
    var qs = document.location.search.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}
	
	$(document).on("click", ".error_msg", function() {
		$(this).text("");
		$(this).parent().children(".inputwrapper").children(".error").focus();
	});

	
	if($(document).width() < 1000){
		function getTextWidth(txt) {
		  var $elm = $('<span class="tempforSize">'+txt+'</span>').prependTo("body");
		  var elmWidth = $elm.width();
		  $elm.remove();
		  return elmWidth;
		}
		function centerSelect($elm) {
			var optionWidth = getTextWidth($elm.children(":selected").html())
			var emptySpace =   $elm.width()- optionWidth;
			//$elm.css("text-indent", (emptySpace/2) - 10);// -10 for some browers to remove the right toggle control width
		}
		// on start 
		$('#region').each(function(){
		  centerSelect($(this));
		});
		// on change
		$('#region').on('change', function(){
		  centerSelect($(this));
		});
	}



	// Accessibility placeholder toggle
	var placeholder = "";
	$("input").focusin(function () {
		placeholder = $(this).attr("placeholder");
		$(this).attr("placeholder", "");
	})
	.focusout(function () {
		$(this).attr("placeholder", placeholder);
	});
	
	$('body').flowtype({
		minimum   : 220,
		maximum   : 1200,
		minFont   : 11,
		maxFont   : 60,
		fontRatio : 21.5
	});
	
   // IE9 placeholder fix
    $("input").placeholder();
	var validator = new FormValidator('contact_form',[{
		name: 'full_name',
		rules: 'required|callback_alpha_space'		
	},{
		name: 'phone',
		rules: 'required|numeric|min_length[7]'		
	}
	], function(errors, event) {
		$(".error_msg").text("");
		if(errors.length > 0){
		console.log(errors);
		$("#"+errors[0].id).focus();
			for(var i = 0; i < errors.length; i++){
			$("#"+errors[i].id+"-error").text("שדה חובה");
			}
		}
		else{
			 $("#lead_frame").load(function () {
                dataLayer.push({
                    'Category': 'Minisite',
                    'Action': 'lead',
                    'Label': 'send',
                    'event': 'auto_event'
                });
			});
			    $("#contact_form").attr("aria-hidden", "true");
                $("#thanks").attr("aria-hidden", "false");
				//SeeRM API
			$.ajax({
			url : "https://seerm.co.il/api.php",
			type: "POST",
			data : {
				campaign_id: '9',
				key: '206c0c78db5a510782c5c114c708060f',
				source: 'springdev',
				full_name: $("#full_name").val(),
				phone1: $("#phone").val(),
				ext1: $("#site").val(),
				ext2: $("#tool").val()
			},
			success: function(data, textStatus, jqXHR){
				console.log("success!\n"+data);
			},
			error: function (jqXHR, textStatus, errorThrown){
				console.log("Error: "+errorThrown); 
			}
		});
		}
	});
validator.registerCallback('check_selection', function(value) {
    if (value && value!=0) {
        return true;
    }
    return false;
});
validator.registerCallback('alpha_space',function(value){
	 return value == value.match(/^[a-zA-Z\s\u0590-\u05fe]+$/);
});
});