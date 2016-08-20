var hoverTimeout;
var classes = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
var randomnumber = Math.floor(Math.random()*classes.length);
var url = $(this).attr("href");
var navigourl = $(this).attr("data-navigo");


var router = new Navigo();

router.on({
    
    // LANDING
    
    function () {
        $("body").attr("class", "index"); 
        $('.pageloadanim').addClass('u__anim-in');
        
        // Load per lang cookie
        if ($.cookie("wilnicholscom-fr")) {
            $(":root").attr("lang", "fr");
            $("nav").load("components/component-nav-fr.html");
            setTimeout(function(){
                $("footer .footer-load *").remove();
                $(".load").load("components/page-index-fr.html", function() {
                    $(".pageloadanim.u__anim-in").removeClass("u__anim-in").addClass("u__anim-out");
                    setTimeout(function(){
                        $(".pageloadanim").removeClass("u__anim-out u__anim-in");
                    }, 200); 
                });
            }, 250);
        };
        if ($.cookie("wilnicholscom-en")) {
            $(":root").attr("lang", "en");
            $("nav").load("components/component-nav-en.html");
            setTimeout(function(){
                $("footer .footer-load *").remove();
                $(".load").load("components/page-index-en.html", function() {
                    $(".pageloadanim.u__anim-in").removeClass("u__anim-in").addClass("u__anim-out");
                    setTimeout(function(){
                        $(".pageloadanim").removeClass("u__anim-out u__anim-in");
                    }, 200); 
                });
            }, 250);
        };
        
        $("nav ul a").parent().removeClass("active");
        $("nav ul a").removeClass("active");
    },
    
    // PRODUCTS 
    
    '/products': function () {
        $("body").attr("class", "products");
        
        $("nav ul a").parent().removeClass("active");
        $("a.products").parent().addClass("active");
    },
    
    // ILLUSTRATIONS
    
    '/illustrations': function () {
        $("body").attr("class", "illustrations");
        
        $("nav ul a").parent().removeClass("active");
        $("a.illustrations").parent().addClass("active");
    },
    
    // PHOTOGRAPHY
    
    '/photography': function () {
        $("body").attr("class", "photoraphy");

        $("nav ul a").parent().removeClass("active");
        $("a.photography").parent().addClass("active");
    },
    
    // RÉSUMÉ
    
    '/resume': function () {
        $("body").attr("class", "resume");
        
        setTimeout(function(){
            $("footer .footer-load *").remove();
            $(".load").load("components/page-resume.html #pagejs-load-in", function() {
                $(".pageloadanim.u__anim-in").removeClass("u__anim-in").addClass("u__anim-out");
                setTimeout(function(){
                    $(".pageloadanim").removeClass("u__anim-out u__anim-in");
                }, 200); 
            });
            $("footer .footer-load").load("components/page-resume.html #pagejs-footer-in");
        }, 250);
        
        $("nav ul a").parent().removeClass("active");
        $("a.resume").parent().addClass("active");
    },
    
    // CONTACT
    
    '/contact': function () {
        $("body").attr("class", "contact");
        $('.pageloadanim').addClass('u__anim-in');
        setTimeout(function(){
            
            $(".load").load("components/page-contact-main-en.html", function() {
                $(".pageloadanim.u__anim-in").removeClass("u__anim-in").addClass("u__anim-out");
                setTimeout(function(){
                    $(".pageloadanim").removeClass("u__anim-out u__anim-in");
                }, 200);
            });
            
            $("footer .footer-load").load("components/page-contact-footer.html");
        }, 250);

        $("nav ul a").parent().removeClass("active");
        $("a.contact").parent().addClass("active");
    },
});

$(document).ready(function() {
    
    //why is the below even necessary?
    $("a[data-navigo]").click(function() {
        event.preventDefault();
        router.navigate($(this).attr("href"));
        console.log("ROUTER, GO!");
    });
    
    //replace static hrefs w/ routes b/c graceful js degrad yah
    
    //rand palette
    $("body").attr("id", classes[randomnumber]);
    //lang sel
    $(".lang-en").click(function() {
        $(":root").attr("lang", "en");
        $.cookie("wilnicholscom-en", "english", {
            expires: 365,
            path: '/'
        });
        $.removeCookie('wilnicholscom-fr', { path: '/' });
        $("nav").load("components/component-nav-en.html", function() {
            $("a[data-navigo]").attr("class", navigourl);
        });
        return false;
    });
    $(".lang-fr").click(function() {
        $(":root").attr("lang", "fr");
        $.cookie("wilnicholscom-fr", "french", {
            expires: 365,
            path: '/'
        });
        $.removeCookie('wilnicholscom-en', { path: '/' });
        $("nav").load("components/component-nav-fr.html", function() {
            $("a[data-navigo]").attr("class", navigourl);
        });
        return false;
    });
    
    // mobile menu hover allowance
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
$(document).ajaxComplete(function() {
    
    
    //why is the below even necessary?
    $("a[data-navigo]").click(function() {
        event.preventDefault();
        router.navigate($(this).attr("href"));
        console.log("ROUTER, GO!");
    }); 
});