// TO-DO change "base" to "http://dznr.me" // NO www.
// 
var duration = 200;
var longduration = 800;

//local var base = "http://localhost:8000";
var base = "http://localhost:8000";

var externalref = true;
var externalrefstring = 'external referrer';
var fromparent = false;

//scroll code for illustrations detail pages
function lockScroll(){
    $html = $('html'); 
    $body = $('body'); 
    var initWidth = $body.outerWidth();
    var initHeight = $body.outerHeight();
    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];
    $html.data('scroll-position', scrollPosition);
    $html.data('previous-overflow', $html.css('overflow'));
    $html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);   
    var marginR = $body.outerWidth()-initWidth;
    var marginB = $body.outerHeight()-initHeight; 
    $body.css({'margin-right': marginR,'margin-bottom': marginB});
} 

function unlockScroll(){
    $html = $('html');
    $body = $('body');
    $html.css('overflow', $html.data('previous-overflow'));
    var scrollPosition = $html.data('scroll-position');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);    
    $body.css({'margin-right': 0, 'margin-bottom': 0});
}

function pageSetup () {
    var thisPageContents = undefined; 
    $(".load #no-js").remove();
    console.log(externalrefstring);
}

function setSubPageLinks () {
    $("a[data-navigo].data-navigo-sub").click(function() {
        event.preventDefault();
        router.navigate($(this).attr("href"));
        var fromparent = true;
    });
}

function pageChange (thisPageTemplate, thisPageName){
    console.log(thisPageName);
    $("body").removeClass("loaded").addClass("loading");
    $("footer .footer-load *").remove();
    $.get(thisPageTemplate, function(thisPageContents) {
        var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
        var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
        $("nav ul li a").parent("li").removeClass("active");
        $("nav ul li a[href='../" + thisPageName + "/']").parent("li").addClass("active");
        setTimeout(function(){
            $("body").attr("class", "loaded " + thisPageName);
            $(".load").html(thisPageMain);
            $("footer .footer-load").html(thisPageFooter);
            setSubPageLinks();
            carousel();
            setTimeout(function(){
                $("main").removeClass("from-sub");
            }, longduration);   
        }, duration);  
    });
}

var router = new Navigo(root=null, useHash=false);

$(document).ready(function() {
    var navtemplate = base + "/components/component-nav.html"
    
    console.log("Document Ready");
    
    $('.load, .mobile-menu li a, .home').click(function() {
        $('.mobile-menu-container').removeClass('large');
        $('.mobile-menu').addClass('u__anim-out'); 
        setTimeout(function() {
            $('.mobile-menu').removeClass('visible u__anim-out');
        }, duration);
    });
    
    $.get(navtemplate, function(thisPageNav) {
        console.log('inserted nav');
        $("header").html(thisPageNav);
        $("nav a[data-navigo]").click(function() {
            externalref = false;
            externalrefstring = 'not external referrer';
            event.preventDefault();
            router.navigate($(this).attr("href"));
        });
        
        // expand menu
        var menubuttonpressed = false;
        $('.mobile-menu-link').click(function() {
            menubuttonpressed = !menubuttonpressed;
            if (menubuttonpressed) {
                $('.mobile-menu-container').addClass('large'); 
                $('.mobile-menu').addClass('visible');
            } else {
                $('.mobile-menu-container').removeClass('large');
                $('.mobile-menu').addClass('u__anim-out'); 
                setTimeout(function() {
                    $('.mobile-menu').removeClass('visible u__anim-out');
                }, duration);
            }
        });
        $('.mobile-menu li').click(function() {
            menubuttonpressed = !menubuttonpressed;
            $('.mobile-menu-container').removeClass('large');
            $('.mobile-menu').addClass('u__anim-out'); 
            setTimeout(function() {
                $('.mobile-menu').removeClass('visible u__anim-out');
            }, duration);
        })
    });
router.on({
        // PRODUCTS 
        
        '/products/': function () {
            pageSetup();
            var thisPageTemplate = base + "/components/page-products.html"
            var thisPageName = "products"
            
            document.title = "Wil Nichols : Products";
            
        },
        
        // INDIVIDUAL ILLUSTRATION
        '/illustrations/:illustration': function (params) {
            pageSetup();
            var thisPageName = "illustrations";
            var thisPageTemplate = base + "/components/page-" + thisPageName + ".html";
            var thisSubPageName = params.illustration.split('#')[0];
            var thisSubPageTemplate = base + "/components/illustrations/" + thisSubPageName + ".html";
            var hash = window.location.href.split('#')[1] || '';
            
            document.title = "Wil Nichols : Illustrations : " + thisSubPageName;
            
            // TO-DO: if hash matches id in tab-content, add active/inactive class there and in ul.tabs
            $("body").removeClass("loaded").addClass(thisPageName + " illustration loading-sub " + thisSubPageName);
            console.log(params.illustration);
            $.get(thisSubPageTemplate , function(thisSubPageContents) {
                var thisSubPageMain = $(thisSubPageContents).filter("#pagejs-load-in-sub");
                var thisSubPageFooter = $(thisSubPageContents).filter("#pagejs-footer-in");
                $(".load #no-js").remove();
                $(".load").prepend(thisSubPageMain);
                $("nav ul li").removeClass("active");
                $("a[href='../illustrations/']").parent().addClass("active");
                lockScroll();
                $("a[data-navigo]").click(function() {
                    unlockScroll();
                });
                $("a.navigo-back-to-parent").click(function() {
                    event.preventDefault();
                    $("body").addClass("unloading-sub");
                    setTimeout(function(){
                        $(".modal.anim-in").removeClass("anim-in");
                        $(".modal-wrapper").remove();
                    }, duration);  
                    $("main").addClass("from-sub");  
                    router.navigate('../illustrations');
                });
                window.onkeypress = function() {
                   if (event.keyCode == 033) {
                       //do it this way so that when the modal is removed, it can't fire again yeh
                      $("a.navigo-back-to-parent").click();
                   }
                }
                //tabs on-click
                $("a.hash-sub").click(function(){
                    var value = $(this).attr('id');
                    //prevent reload
                    event.preventDefault();
                    //tabs styling
                    $(this).parent().siblings().removeClass("active");
                    $(this).parent().addClass("active");
                    //make url readable/shareableb
                    history.pushState(null, null, '#' + value);
                    $(".tabs-content *").removeClass("active");
                    $(".tabs-content ." + value).addClass("active");
                });
                //direct linking to tabs
                if (location.hash) {
                    $("a.hash-sub").parent().siblings().removeClass("active");
                    $("a.hash-sub").css("margin-top", "9px");
                    $("a.hash-sub#" + hash).parent().addClass("active");
                    $(".tabs-content *").removeClass("active");
                    $(".tabs-content ." + hash).addClass("active");
                };
                // separate animation to new class and remove class after animation duration so no repaint at breakpoints    
                setTimeout(function(){
                    $(".modal.anim-in").removeClass("anim-in");
                }, duration);       
                            
                $("footer .footer-load").html(thisSubPageFooter);
                // so when i change .html to .append, the function fires twice. WHY
                $("body").attr("class", "loaded illustration loaded-sub " + thisPageName + " " +thisSubPageName);
            }).fail(function() {
                router.navigate('../illustrations')
            });
            // if entry point is illustrations, add class. Else, load parent and add class.
            if ($('#page-fragment-illustrations').length > 0) { } else {
                $.get(thisPageTemplate , function(thisPageContents) { 
                    var thisPageMain = $(thisPageContents).filter("#page-fragment-illustrations");
                    $(".load *").not(".modal-wrapper, .modal-wrapper *").remove();
                    thisPageMain.addClass("background-page");
                    $(".load").append(thisPageMain);
                });
            };
        },

        // ILLUSTRATIONS
        
        '/illustrations': function () {
            pageSetup();
            var thisPageTemplate = base + "/components/page-illustrations.html"
            var thisPageName = "illustrations"
            
            document.title = "Wil Nichols : Illustrations";
            
            $("body").removeClass("loaded").addClass("loading");
            $("footer .footer-load *").remove();
            $.get(thisPageTemplate, function(thisPageContents) {
                var thisPageHeader = $(thisPageContents).filter("#header-fragment-" + thisPageName);
                var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
                var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
                $("nav ul li a").parent("li").removeClass("active");
                $("nav ul li a[href='../" + thisPageName + "/']").parent("li").addClass("active");
                setTimeout(function(){
                    $("body").attr("class", "loaded " + thisPageName);
                     console.log("headertext" + $(thisPageHeader).html());
                    $("#pageheader-load").html(thisPageHeader);
                    $(".load").html(thisPageMain);
                    $("footer .footer-load").html(thisPageFooter);
                    setSubPageLinks();
                    setTimeout(function(){
                        $("main").removeClass("from-sub");
                    }, longduration);   
                }, duration);  
            });
        },
        
        // INDIVIUAL PHOTO
    
        '/photography/:collection': function (params) {
            pageSetup();
            var url = window.location.pathname;
            var filename = url.substring(url.lastIndexOf('/')+1);
            var thisPageName = "photography";
            var thisSubPageName = params.collection.split('#')[0];
            var thisPageTemplate = base + "/components/photography/" + thisSubPageName + ".html";
            var hash = window.location.href.split('#')[1] || '';
            
            document.title = "Wil Nichols : Photography : " + thisSubPageName;
            $("body").attr("class", "photography unloading " + thisPageName + " loading-sub " + thisSubPageName).attr("id", "photography");
            console.log(thisSubPageName);
            $.get(thisPageTemplate, function(thisPageContents) {
                var thisPageMain = $(thisPageContents).filter("#subpage-fragment-album");
                var thisPageFooter = $(thisPageContents).filter("#footer-fragment-album");
                var thumbnails = thisPageMain.find("ul.photo-carousel").children().clone()
                //for lists
                thisPageMain.find("ul.photo-list li img").each(function() {
                    var thisfilename =  $(this).attr('alt');
                    $(this).attr("src", base + "/static/img/" + thisPageName + "/" + thisSubPageName + "/lg/" + thisfilename);
                });
                //for carousels
                thisPageMain.find("ul.photo-carousel").addClass("masthead").wrap("<div class='photo-carousel'></div>");
                thisPageMain.find("div.photo-carousel").append("<ul class='photo-carousel thumbnails'></ul>");
                thisPageMain.find("ul.photo-carousel.thumbnails").append(thumbnails);
                thisPageMain.find("ul.photo-carousel li:first-of-type").addClass("active");
                thisPageMain.find("ul.photo-carousel.masthead li img").each(function() {
                    var thisfilename =  $(this).attr('alt');
                    $(this).attr("src", base + "/static/img/" + thisPageName + "/" + thisSubPageName + "/lg/" + thisfilename);
                });
                thisPageMain.find("ul.photo-carousel.thumbnails li img").each(function() {
                    var thisfilename =  $(this).attr('alt');
                    $(this).attr("src", base + "/static/img/" + thisPageName + "/" + thisSubPageName + "/sm/" + thisfilename).wrap("<a class='hash-sub' href='#" + thisfilename + "'></a>");
                });                                      
                
                setTimeout(function(){ 
                    $("a[href='../photography/']").parent().addClass("active");
                    $(".load").html(thisPageMain);
                    $("footer .footer-load").html(thisPageFooter);
                    $("body").attr("class", "photography photography-sub loaded-sub " + thisSubPageName); 
                    $("a.navigo-back-to-parent").click(function() {
                        $("body").addClass("unloading-sub");
                        event.preventDefault();
                        router.navigate($(this).attr("href"));
                        $("main").addClass("from-sub");
                    });
                    window.onkeypress = function() {
                       if (event.keyCode == 033) {
                           //do it this way so that when the modal is removed, it can't fire again yeh
                          $("a.navigo-back-to-parent").click();
                       }
                    }                    
                    if (location.hash) {
                        console.log("hash-val " + hash);
                        document.title = "Wil Nichols : Photography : " + thisSubPageName + " : " + hash;
                        //remove all selections
                        $("ul.photo-carousel li").removeClass("active")
                        //active class on main
                        $("img[alt='" + hash + "']").parent("li").addClass("active");
                        //active class on thumbnail // could do it with .parents(), it'd be less efficient but much more succinct
                        $("a[href='#" + hash + "']").parent("li").addClass("active");
                    };
                    $("a.hash-sub").click(function(){
                        var thisfilename =  $(this).children().attr('alt');
                        //prevent reload
                        event.preventDefault();
                        history.pushState(null, null, '#' + thisfilename);
                        //remove all selections
                        $("ul.photo-carousel li").removeClass("active")
                        //active class on main
                        $("img[alt='" + thisfilename + "']").parent("li").addClass("active");
                        //active class on thumbnail // could do it with .parents(), it'd be less efficient but much more succinct
                        $("a[href='#" + thisfilename + "']").parent("li").addClass("active");
                        document.title = "Wil Nichols : Photography : " + thisSubPageName + " : " + thisfilename;
                    });

                }, duration);
            }); 
        },            
        // PHOTOGRAPHY
        
        '/photography/': function () {
            pageSetup();
            var thisPageTemplate = base + "/components/page-photography.html"
            var thisPageName = "photography"
            
            
            document.title = "Wil Nichols : Photography";
            
            $("body").removeClass("loaded").addClass("loading");
            $("footer .footer-load *").remove();
            $.get(thisPageTemplate, function(thisPageContents) {
                var thisPageHeader = $(thisPageContents).filter("#header-fragment-" + thisPageName);
                var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
                var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
                $("nav ul li a").parent("li").removeClass("active");
                $("nav ul li a[href='../" + thisPageName + "/']").parent("li").addClass("active");
                setTimeout(function(){
                    $("body").attr("class", "loaded " + thisPageName);
                     console.log("headertext" + $(thisPageHeader).html());
                    $("#pageheader-load").html(thisPageHeader);
                    $(".load").html(thisPageMain);
                    $("footer .footer-load").html(thisPageFooter);
                    setSubPageLinks();
                    carousel();
                    setTimeout(function(){
                        $("main").removeClass("from-sub");
                    }, longduration);   
                }, duration); 
            });
        },
        
        // INDIVIUAL PHOTO
        
        // RÉSUMÉ
        
        '/resume/': function () {
            pageSetup();
            var thisPageTemplate = base + "/components/page-resume.html"
            var thisPageName = "resume"
            
            document.title = "Wil Nichols : Résumé";
            
            $("body").removeClass("loaded").addClass("loading");
            $("footer .footer-load *").remove();
            $.get(thisPageTemplate, function(thisPageContents) {
                var thisPageHeader = $(thisPageContents).filter("#header-fragment-" + thisPageName);
                var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
                var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
                $("nav ul li a").parent("li").removeClass("active");
                $("nav ul li a[href='../" + thisPageName + "/']").parent("li").addClass("active");
                setTimeout(function(){
                    $("body").attr("class", "loaded " + thisPageName);
                     console.log("headertext" + $(thisPageHeader).html());
                    $("#pageheader-load").html(thisPageHeader);
                    $(".load").html(thisPageMain);
                    $("footer .footer-load").html(thisPageFooter);
                    setSubPageLinks();
                    carousel(); 
                }, duration);  
            });
        },
        
        // CONTACT
        
        '/contact/': function () {
            pageSetup();
            var thisPageTemplate = base + "/components/page-contact.html"
            var thisPageName = "contact"
            
            document.title = "Wil Nichols : Contact";
            
            $("body").removeClass("loaded").addClass("loading");
            $("footer .footer-load *").remove();
            $.get(thisPageTemplate, function(thisPageContents) {
                var thisPageHeader = $(thisPageContents).filter("#header-fragment-" + thisPageName);
                var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
                var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
                $("nav ul li a").parent("li").removeClass("active");
                $("nav ul li a[href='../" + thisPageName + "/']").parent("li").addClass("active");
                setTimeout(function(){
                    $("body").attr("class", "loaded " + thisPageName);
                    console.log("headertext" + $(thisPageHeader).html());
                    $("#pageheader-load").html(thisPageHeader);
                    $(".load").html(thisPageMain);
                    $("footer .footer-load").html(thisPageFooter);
                    setSubPageLinks();
                }, duration);  
            });

        },
        
        // LANDING
        
        '/home/': function () { 
            pageSetup();
            var thisPageTemplate = base + "/components/page-index.html";
            var thisPageName = "index";
            
            document.title = "Wil Nichols";
            $("body").removeClass("loaded").addClass("loading");
            $("footer .footer-load *").remove();
            $.get(thisPageTemplate, function(thisPageContents) {
                var thisPageHeader = $(thisPageContents).filter("#header-fragment-" + thisPageName);
                var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
                var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
                $("nav ul li a").parent("li").removeClass("active");
                $("nav ul li a[href='../" + thisPageName + "/']").parent("li").addClass("active");
                setTimeout(function(){
                    $("body").attr("class", "loaded " + thisPageName);
                    console.log("headertext" + $(thisPageHeader).html());
                    $("#pageheader-load").html(thisPageHeader);
                    $(".load").html(thisPageMain);
                    $("footer .footer-load").html(thisPageFooter);
                    setSubPageLinks();
                }, duration);  
            });
        },
        '*': function () { 
            window.location = "/home";
        },
    });



});

    