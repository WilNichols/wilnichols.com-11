// TO-DO change "base" to "http://dznr.me" // NO www.

var duration = 200;
var longduration = 800;

//var base = "http://localhost:8000";
var base = "http://Wils-MacBook-Pro.local:8000";
var prevpage = 'none';
var fromillsub = false;
var referrer = "";

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

function pageSetup (thisPageName) {
    var thisPageContents
    if(prevpage === 'home') {
        console.log("from home")
        fromillsub = false;
    } 
    if(prevpage === 'illustrations') {
        console.log("from illustrations")
    } 
    if(prevpage === 'photography') {
        console.log("from photography")
        fromillsub = false;
    } 
    if(prevpage === 'resume') {
        console.log("from resume")
        fromillsub = false;
    }
    if(prevpage === 'contact') {
        console.log("from contact")
        fromillsub = false;
    }
    if(prevpage === 'none') {
        $(".load #no-js").remove();
        console.log("from none")
        fromillsub = false;
    }
}

function setLinks() {
    $("nav a[data-navigo]").click(function() {
        event.preventDefault();
        router.navigate($(this).attr("href"));
        
    });
}
function setSubPageLinks () {
    $("a[data-navigo].data-navigo-sub").click(function() {
        event.preventDefault();
        router.navigate($(this).attr("href"));
    });
}

// pages 

function makeHome () {
    pageSetup();
    var thisPageTemplate = base + "/components/page-index.html";
    var thisPageName = "index";
    
    // top level page transitions
    
    if(prevpage !== 'none') {
        $("body").addClass("unloading-" + prevpage);
        console.log("unloading-" + prevpage);
    }
    
    document.title = "Wil Nichols";
    $("body").removeClass("loaded").addClass("loading loading-" + thisPageName);
    $("footer .footer-load *").remove();
    $.get(thisPageTemplate, function(thisPageContents) {
        var thisPageHeader = $(thisPageContents).filter("#header-fragment-" + thisPageName);
        var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
        var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
        $("nav ul li a").parent("li").removeClass("active");
        $("nav ul li a[href='../" + thisPageName + "/']").parent("li").addClass("active");
        setTimeout(function(){
            $("body").attr("class", "loaded " + thisPageName);
            $("#pageheader-load").html(thisPageHeader);
            $(".load").attr('style', '').html(thisPageMain);
            $("footer .footer-load").html(thisPageFooter);
            setSubPageLinks();
        }, duration);  
    });
    prevpage = "home";
    fromillsub = false;
}
function makeWork () {
    pageSetup(prevpage);
    var thisPageTemplate = base + "/components/page-work.html"
    var thisPageName = "work"
    
    // top level page transitions
    
    if(prevpage !== 'none') {
        $("body").addClass("unloading-" + prevpage);
        console.log("unloading-" + prevpage);
    }
    
    document.title = "Wil Nichols : Work";

    $("body").removeClass("loaded").addClass("loading loading-" + thisPageName);
    $("footer .footer-load *").remove();
    $.get(thisPageTemplate, function(thisPageContents) {
        var thisPageHeader = $(thisPageContents).filter("#header-fragment-" + thisPageName);
        var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
        var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
        $("nav ul li a").parent("li").removeClass("active");
        $("nav ul li a[href='../" + thisPageName + "/']").parent("li").addClass("active");
        setTimeout(function(){
            $("body").attr("class", "loaded " + thisPageName);
            $("#pageheader-load").html(thisPageHeader);
            $(".load").attr('style', '').html(thisPageMain);
            $("footer .footer-load").html(thisPageFooter);
            setSubPageLinks();
            $('.load').css('height', $(".work-table").height() + 24);  
            $(window).on('resize', function(){
                $('.load').css('height', $(".work-table").height() + 24);  
            });
        }, duration);  
    });
    prevpage = "work"
}

function makeWorkSub(params) {
    pageSetup();
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/')+1);
    var thisPageName = "work";
    var thisSubPageName = params.project.split('#')[0];
    var thisPageTemplate = base + "/components/work/" + thisSubPageName + ".html";
    var pageTitle = thisSubPageName.replace(/_/g , ". ").replace(/--/g , " : ");
    var hash = window.location.href.split('#')[1] || '';
    function hashPage() {
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
            document.title = "Wil Nichols : Photography : " + pageTitle + " : " + thisfilename;
        });
        if (location.hash) {
            console.log("hash-val " + hash);
            //remove all selections
            $("ul.photo-carousel li").removeClass("active")
            //active class on main
            $("img[alt='" + hash + "']").parent("li").addClass("active");
            //active class on thumbnail // could do it with .parents(), it'd be less efficient but much more succinct
            $("a[href='#" + hash + "']").parent("li").addClass("active");
        };
    }
    
    document.title = "Wil Nichols : Work : " + pageTitle;
    $("body").attr("class", "work unloading " + thisPageName + " loading-sub " + thisSubPageName).attr("id", "work");
    console.log(thisSubPageName);
    $.get(thisPageTemplate, function(thisPageContents) {
        var thisPageHeader = $(thisPageContents).filter("#header-fragment-" + thisSubPageName);
        var thisPageMain = $(thisPageContents).filter("#subpage-fragment-" + thisPageName);
        var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisSubPageName);
        
        setTimeout(function(){ 
            $("a[href='../work/']").parent().addClass("active");
            $("#pageheader-load").html(thisPageHeader);
           $(".load").attr('style', '').html(thisPageMain);
            $("footer .footer-load").html(thisPageFooter);
            $("body").attr("class", "work work-sub loaded-sub " + thisSubPageName);           
            hashPage();
        }, duration);
    }).fail(function() {
        router.navigate('../work')
    }); 

}


function makeIllustrations() {
    pageSetup();
    var thisPageTemplate = base + "/components/page-illustrations.html"
    var thisPageName = "illustrations"
    
    document.title = "Wil Nichols : Illustrations";
    
    if(fromillsub === false) {
        $("body").removeClass("loaded").addClass("loading");
        $("footer .footer-load *").remove();
        $.get(thisPageTemplate, function(thisPageContents) {
            var thisPageHeader = $(thisPageContents).filter("#header-fragment-" + thisPageName);
            var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
            var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
            $("nav ul li a").parent("li").removeClass("active");
            $("nav ul li a[href='../" + thisPageName + "/']").parent("li").addClass("active");
            console.log('is anyone listening');
            setTimeout(function(){
                $("body").attr("class", "loaded " + thisPageName);
                $("#pageheader-load").html(thisPageHeader);
                $("footer .footer-load").html(thisPageFooter);
                $(".load").attr('style', '').html(thisPageMain).trigger("insert-page");
                setSubPageLinks();
                setTimeout(function(){
                    $("main").removeClass("from-sub");
                }, longduration);   
            }, duration);  
        });
    } else {
        setTimeout(function(){
            $("body").attr("class", "loaded " + thisPageName);
            $(".modal-wrapper").remove();
        }, duration)
        console.log('from sub');
        
    }
    prevpage = "illustrations"
}
function makeIllustrationsSub(params) {
    pageSetup();
    
    var thisSubPageName = params.illustration.split('#')[0];
    var thisSubPageTemplate = base + "/components/illustrations/" + thisSubPageName + ".html";
    var hash = window.location.href.split('#')[1] || '';
    function hashroute() {
        if (location.hash) {
            console.log("there's a hash");
            $("a.hash-sub").parent().siblings().removeClass("active");
            $("a.hash-sub#" + hash).parent().addClass("active");
            $(".tabs-content *").removeClass("active");
            $(".tabs-content ." + hash).addClass("active");
        };
    }
    function hashsub() {
        $("a.hash-sub").click(function(){
            var value = $(this).attr('id');
            //prevent reload
            event.preventDefault();
            //tabs styling
            $(this).parent().siblings().removeClass("active");
            $(this).parent().addClass("active");
            //make url readable/shareable
            history.pushState(null, null, '#' + value);
            $(".tabs-content *").removeClass("active");
            $(".tabs-content ." + value).addClass("active");
        });
    }
    function modalclose() {
        $("a.navigo-back-to-parent").click(function() {
            $(".load").off();
            event.preventDefault();
            $(".modal").addClass("anim-out");
            $("body").removeClass("loaded-sub").addClass("unloading-sub");
            setTimeout(function(){
                $("body").removeClass(hash);
                unlockScroll();
                router.navigate('../illustrations');  
            }, duration);  
            
        });
    }
    
    document.title = "Wil Nichols : Illustrations : " + thisSubPageName;
    
    $("body").removeClass("loaded").addClass(prevpage + " illustration loading-sub " + thisSubPageName);
    $.get(thisSubPageTemplate , function(thisSubPageContents) {
        var thisSubPageMain = $(thisSubPageContents).filter("#pagejs-load-in-sub");
        var thisSubPageFooter = $(thisSubPageContents).filter("#pagejs-footer-in");
        
        if(prevpage === 'illustrations') {
            $(".load").prepend(thisSubPageMain);
            $("body").attr("class", "loaded illustration loaded-sub " + prevpage + " " +thisSubPageName);
            hashsub();
            hashroute();
            modalclose(hash);
            fromillsub = true;
        } else {
            makeIllustrations();
            $(".load").on("insert-page", function () {
                $("body").attr("class", "loaded illustrations illustration loaded-sub " +thisSubPageName);
                $(".load").prepend(thisSubPageMain);
                console.log("inserted modal");
                hashroute();
                hashsub();
                modalclose(hash);
                fromillsub = true;
            });
            
                        
        }
        lockScroll();
    
        window.onkeydown = function() {
           if (event.keyCode == 033) {
               //do it this way so that when the modal is removed, it can't fire again yeh
              $("a.navigo-back-to-parent").click();
           }
        }
        //tabs on-click
        
        //direct linking to tabs
        // separate animation to new class and remove class after animation duration so no repaint at breakpoints    
        setTimeout(function(){
            $(".modal.anim-in").removeClass("anim-in");
        }, duration);
    }).fail(function() {
        router.navigate('../illustrations')
    });
    
}
function makePhotography() {
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
            $("#pageheader-load").html(thisPageHeader);
           $(".load").attr('style', '').html(thisPageMain);
            $("footer .footer-load").html(thisPageFooter);
            setSubPageLinks();
            setTimeout(function(){
                $("main").removeClass("from-sub");
            }, longduration);   
        }, duration); 
    });
    prevpage = "photography";
    fromillsub = false;
}
function makePhotographySub(params) {
    pageSetup();
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/')+1);
    var thisPageName = "photography";
    var thisSubPageName = params.collection.split('#')[0];
    var thisPageTemplate = base + "/components/photography/" + thisSubPageName + ".html";
    var pageTitle = thisSubPageName.replace(/_/g , ". ").replace(/--/g , " : ");
    var hash = window.location.href.split('#')[1] || '';
    
    function albumClose() {
        $("a.navigo-back-to-parent").click(function() {
            $("body").addClass("unloading-sub");
            event.preventDefault();
            router.navigate($(this).attr("href"));
            $("main").addClass("from-sub");
        });
    }

    function hashPage() {
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
            document.title = "Wil Nichols : Photography : " + pageTitle + " : " + thisfilename;
        });
        if (location.hash) {
            console.log("hash-val " + hash);
            //remove all selections
            $("ul.photo-carousel li").removeClass("active")
            //active class on main
            $("img[alt='" + hash + "']").parent("li").addClass("active");
            //active class on thumbnail // could do it with .parents(), it'd be less efficient but much more succinct
            $("a[href='#" + hash + "']").parent("li").addClass("active");
        };
    }
    
    document.title = "Wil Nichols : Photography : " + pageTitle;
    $("body").attr("class", "photography unloading " + thisPageName + " loading-sub " + thisSubPageName).attr("id", "photography");
    console.log(thisSubPageName);
    $.get(thisPageTemplate, function(thisPageContents) {
        var thisPageHeader = $(thisPageContents).filter("#header-fragment-album");
        var thisPageMain = $(thisPageContents).filter("#subpage-fragment-album");
        var thisPageFooter = $(thisPageContents).filter("#footer-fragment-album");
        var thumbnails = thisPageMain.find("ul.photo-carousel").children().clone()

        thisPageMain.find("ul.photo-carousel").addClass("masthead").wrap("<div class='photo-carousel'></div>");
        thisPageMain.find("div.photo-carousel").append("<ul class='photo-carousel thumbnails'></ul>");
        thisPageMain.find("ul.photo-carousel.thumbnails").append(thumbnails);
        thisPageMain.find("ul.photo-carousel li:first-of-type").addClass("active");
        thisPageMain.find("ul.photo-carousel.masthead li img").each(function(thisfilename) {
            var thisfilename =  $(this).attr('alt');
            $(this).attr("src", base + "/static/img/" + thisPageName + "/" + thisSubPageName + "/lg/" + thisfilename);
        });
        
        thisPageMain.find("ul.photo-carousel.thumbnails li img").each(function() {
            var thisfilename =  $(this).attr('alt');
            $(this).attr("src", base + "/static/img/" + thisPageName + "/" + thisSubPageName + "/sm/" + thisfilename).wrap("<a class='hash-sub' href='#" + thisfilename + "'></a>");
        });                                      
        
        setTimeout(function(){ 
            $("a[href='../photography/']").parent().addClass("active");
            $("#pageheader-load").html(thisPageHeader);
           $(".load").attr('style', '').html(thisPageMain);
            $("footer .footer-load").html(thisPageFooter);
            $("body").attr("class", "photography photography-sub loaded-sub " + thisSubPageName); 
            albumClose();               
            hashPage();
            window.onkeydown = function() {
               if (event.keyCode == 033) {
                   //do it this way so that when the modal is removed, it can't fire again yeh
                  $("a.navigo-back-to-parent").click();
               }
               if (event.keyCode == 37) {
                  $("ul.photo-carousel.thumbnails li.active").prev().children().click();
               }
               if (event.keyCode == 39) {
                  $("ul.photo-carousel.thumbnails li.active").next().children().click();
               }
            }     
        }, duration);
    }).fail(function() {
        router.navigate('../photography')
    }); 
}

function makeResume() {
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
            $("#pageheader-load").html(thisPageHeader);
           $(".load").attr('style', '').html(thisPageMain);
            $("footer .footer-load").html(thisPageFooter);
            setSubPageLinks();
        }, duration);  
    });
    prevpage = "resume";
    fromillsub = false;
}
function makeContact() {
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
            $("body").attr("class", "loaded " + thisPageName + " " + referrer);
            $("#pageheader-load").html(thisPageHeader);
           $(".load").attr('style', '').html(thisPageMain);
            $("footer .footer-load").html(thisPageFooter);
            setSubPageLinks();
        }, duration);  
    });
    prevpage = "contact";
    fromillsub = false;
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
        setLinks();
        
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
        // LANDING
        '/home/': function () { makeHome(); },
        
        // INDIVIDUAL PROJECT 
        '/work/:project/': function (params) { makeWorkSub(params); },
        
        // PROJECTS
        '/work/': function () { makeWork(); },
        
        // INDIVIDUAL ILLUSTRATION
        '/illustrations/:illustration/': function (params) { makeIllustrationsSub(params); },

        // ILLUSTRATIONS
        '/illustrations/': function () { makeIllustrations(); },
        
        // INDIVIUAL PHOTO
        '/photography/:collection/': function (params) { makePhotographySub(params); },            
        
        // PHOTOGRAPHY
        '/photography/': function () { makePhotography(); },
        
        // RÉSUMÉ
        '/resume/': function () { makeResume(); },
        
        // CONTACT
        '/contact/': function () { makeContact(); },
        
        '*': function () { window.location = "/home"; }
    });
});