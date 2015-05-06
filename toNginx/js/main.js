var p=false;
var n=false;
var info = "";
var hover = "";
$(document).ready(function(){
	var hash = window.location.hash;
	if(window.location.hash!=""){
		if(hash.search("portfolio")!=-1){
			hash = hash.split("/")[1];
			hash = hash.toLowerCase();
		}else{
			hash = window.location.hash.split("#")[1];
		}
	}else{
		hash = "about";
	}
	if(hash=="about")
		$("#blog").show();
	$.get("http://www.orbweaverdev.com:81/"+hash, function(data){
			$(".info").append(data);
			$(".info").fadeIn('fast');
		});
	$(document).click(function(){
		if($("#portfolio").is(":visible")&&p){
			$('#portfolio').slideUp('fast');
			p=false;
		}
	});
	$(".port").click(function(){
		setTimeout( function(){
			if(!p&&!$("#portfolio").is(":visible")){
				$("#portfolio").slideDown('fast');
				p = true;
			}
		}, 200);
	});
	$('.home').click(function(){
		window.location.hash = "about";
		$.get("http://www.orbweaverdev.com:81/about", function(data){
			$(".info").hide();
			$(".info").empty();
			$(".info").append(data);
			$(".info").fadeIn('fast');
		});
	});
	$('.contact').click(function(e){
		e.preventDefault();
		window.location.hash = "contact";
		$.get("http://www.orbweaverdev.com:81/contact", function(data){
			$(".info").hide();
			$(".info").empty();
			$(".info").append(data);
			$(".info").fadeIn('fast');
			window.scrollTo(0,0);
		});
	});
	$('.blog').click(function(e){
		e.preventDefault();
		window.location.hash = "blog";
		$.get("http://www.orbweaverdev.com:81/blog", function(data){
			$(".info").hide();
			$(".info").empty();
			$(".info").append(data);
			$(".info").fadeIn('fast');
			window.scrollTo(0,0);
		});
	});
	$(".site").click(function(){
		window.location.hash = "#portfolio/"+hover;
		if(window.innerWidth<=1200){
			hover = $(this).attr('id');
			hover = hover.toLowerCase();
			$.get(("http://www.orbweaverdev.com:81/"+hover), function(data){
				info = data;
				$(".info").hide();
				$(".info").empty();
				$(".info").append(info);
				$(".info").fadeIn('fast');
			});
		}else{
			$(".info").hide();
			$(".info").empty();
			$(".info").append(info);
			$(".info").fadeIn('fast');
		}
	});
	$('.site').mouseenter(function(){
		$(this).animate({opacity: '1'});
		hover = $(this).attr('id');
		hover = hover.toLowerCase();
		$.get(("http://www.orbweaverdev.com:81/"+hover), function(data){
			info = data;
		});
	});
	$('.site').mouseleave(function(){
		$(this).animate({opacity: '.5'});
	});
	$("#menu").click(function(){
		$("#nav").toggle('fast');
	});
	$("#nav span").click(function(){
		if(window.innerWidth <=1200){
			$("#nav").slideUp();
		}
	});
	$("#boiler-info a").click(function(){
		window.location.replace("http://www.orbweaverdev.com:8080")
	});
	$("#message-info").click(function(){
		window.location.replace("http://www.orbweaverdev.com:82")
	});
});