var hoverTimeout;
var classes = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
var randomnumber = Math.floor(Math.random()*classes.length);
var url = $(this).attr("href");

var router = new Navigo();
router.on({
    '/products': function () {
        $("body").attr("class", "products");
        
        $("nav ul a").parent().removeClass("active");
        $("a.products").parent().addClass("active");
    },
    '/illustrations': function () {
        $("body").attr("class", "illustrations");
        
        $("nav ul a").parent().removeClass("active");
        $("a.illustrations").parent().addClass("active");
    },
    '/photography': function () {
        $("body").attr("class", "photoraphy");

        $("nav ul a").parent().removeClass("active");
        $("a.photography").parent().addClass("active");
    },
    '/resume': function () {
        setTimeout(function(){
            $("body").attr("class", "resume");
            $("nav ul a").parent().removeClass("active");
            $("a[href='resume']").parent().addClass("active");
            
            $("footer .footer-load *").remove();
            $(".load").load("components/page-resume.html #pagejs-load-in", function() {
                $(".pageloadanim.u__anim-in").removeClass("u__anim-in").addClass("u__anim-out");
                setTimeout(function(){
                    $(".pageloadanim").removeClass("u__anim-out u__anim-in");
                }, 200); 
            });
            $("footer .footer-load").load("components/page-resume.html #pagejs-footer-in");
        }, 250);
    },
    '/contact': function () {

        $("body").attr("class", "contact");
        $('.pageloadanim').addClass('u__anim-in');
        
        setTimeout(function(){
            $(".load").load("components/page-contact.html #pagejs-load-in", function() {
                $(".pageloadanim.u__anim-in").removeClass("u__anim-in").addClass("u__anim-out");
                setTimeout(function(){
                    $(".pageloadanim").removeClass("u__anim-out u__anim-in");
                }, 200);
            });
            $("footer .footer-load").load("components/page-contact.html #pagejs-footer-in");
        }, 250);

        $("nav ul a").parent().removeClass("active");
        $("a.contact").parent().addClass("active");
    },
    '*': function () {
        $("body").attr("class", "index"); 
        $('.pageloadanim').addClass('u__anim-in');

        setTimeout(function(){
            $("footer .footer-load *").remove();
            $(".load").load("components/page-index.html #pagejs-load-in", function() {
                $(".pageloadanim.u__anim-in").removeClass("u__anim-in").addClass("u__anim-out");
                setTimeout(function(){
                    $(".pageloadanim").removeClass("u__anim-out u__anim-in");
                }, 200); 
            });
        }, 250);
        
        $("nav ul a").parent().removeClass("active");
        $("nav ul a").removeClass("active");
    },
});



$(document).ready(function() {
    //why is the below even necessary?
    $("a[data-navigo]").click(function() {
        event.preventDefault();
        router.navigate($(this).attr("href"));
		console.log("ROUTER, GO!");
        
    });
    //rand palette
    $("body").attr("id", classes[randomnumber]);
    //lang sel
    if ($.cookie("wilnicholscom-fr")) {
        $(":root").attr("lang", "fr");
    }
    if ($.cookie("wilnicholscom-en")) {
        $(":root").attr("lang", "en");
    }
    $(".lang-en").click(function() {
        $(":root").attr("lang", "en");
        $.cookie("wilnicholscom-en", "english", {
            expires: 365,
            path: '/'
        });
        $.removeCookie('wilnicholscom-fr', { path: '/' });
        return false;
    });
    $(".lang-fr").click(function() {
        $(":root").attr("lang", "fr");
        $.cookie("wilnicholscom-fr", "french", {
            expires: 365,
            path: '/'
        });
        $.removeCookie('wilnicholscom-en', { path: '/' });
        return false;
    });
    //old lang sel
    $(".select").click(function(e) {
        var e=window.event||e;
        $(this).toggleClass("on").removeClass("off");
        e.stopPropagation();
    });
    $(document).click(function(e) {
        $(".select").removeClass("on");
    });
    $('.mobile-menu-container').mouseenter(function() {clearTimeout(hoverTimeout);
        $(this).addClass('large'); 
        $('.mobile-menu').addClass('visible'); 
    });
    $('.mobile-menu-container').mouseleave(function() {
         $(this).removeClass('large');
        $('.mobile-menu').addClass('u__anim-out'); 
        hoverTimeout = setTimeout(function() {
            $('.mobile-menu').removeClass('visible u__anim-out');
        }, 200);
    });
 
});