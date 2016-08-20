// TO-DO change "root" to "http://dznr.me" // NO www.

var hoverTimeout;
var palettes = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
var randomnumber = Math.floor(Math.random()*palettes.length);
var palette = [ 'a', 'b', 'c', 'd', 'e', 'f' ][randomnumber];
var base = "http://localhost:8000";

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
}
function setSubPageLinks () {
    $("a[data-navigo].data-navigo-sub").click(function() {
        event.preventDefault();
        router.navigate($(this).attr("href"));
    });
}

function pageChange (thisPageTemplate, thisPageName){
    $("body").removeClass("loaded").addClass("loading").attr("id", palette);
    console.log(thisPageName);
    setTimeout(function(){
        $("nav ul a").parent().removeClass("active");
        $("a[href='" + thisPageName + "/']").parent().addClass("active");
        $("footer .footer-load *").remove();
        $.get(thisPageTemplate, function(thisPageContents) {
            var thisPageMain = $(thisPageContents).filter("#page-fragment-" + thisPageName);
            var thisPageFooter = $(thisPageContents).filter("#footer-fragment-" + thisPageName);
            $(".load").html(thisPageMain);
            setSubPageLinks();
            $("footer .footer-load").html(thisPageFooter);
            // so when i change .html to .append, the function fires twice. WHY
            $("body").attr("class", "loaded " + thisPageName).attr("id", palette);            
        });
    }, 200); 
}


var router = new Navigo(root=null, useHash=false);

$(document).ready(function() {
    $(":root").attr("class", "js");
    $("body").attr("id", palette);
    console.log("Document Ready");
    $('.mobile-menu-link').funcToggle('click', 
        function(event) {
            event.stopPropagation();
            $('.mobile-menu-container').addClass('large'); 
            $('.mobile-menu').addClass('visible');
        }, 
        function() {
            $('.mobile-menu-container').removeClass('large');
            $('.mobile-menu').addClass('u__anim-out'); 
            hoverTimeout = setTimeout(function() {
                $('.mobile-menu').removeClass('visible u__anim-out');
            }, 200);
    });
    $('.load, .mobile-menu li a, .home').click(function() {
        $('.mobile-menu-container').removeClass('large');
        $('.mobile-menu').addClass('u__anim-out'); 
        hoverTimeout = setTimeout(function() {
            $('.mobile-menu').removeClass('visible u__anim-out');
        }, 200);
    });
    $("a[data-navigo]").click(function() {
        event.preventDefault();
        router.navigate($(this).attr("href"));
    });
});

    router.on({
        // PRODUCTS 
        
        '/products/': function () {
            pageSetup();
            console.log("Products Page");
            
            document.title = "Wil Nichols : Products";
            
            $("body").attr("class", "products");
            
            $("nav ul a").parent().removeClass("active");
            $("a[href='products']").parent().addClass("active");
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
            setTimeout(function(){
                $("a[href='illustrations/']").parent().addClass("active");
                $.get(thisSubPageTemplate , function(thisSubPageContents) {
                    var thisSubPageMain = $(thisSubPageContents).filter("#pagejs-load-in-sub");
                    var thisSubPageFooter = $(thisSubPageContents).filter("#pagejs-footer-in");
                    $(".load #no-js").remove();
                    $(".load").prepend(thisSubPageMain);
                    lockScroll();
                    $("#pagejs-load-in").addClass("background-page");
                    $("a[data-navigo]").click(function() {
                        unlockScroll();
                    });
                    $("a.navigo-back-to-parent").click(function() {
                        event.preventDefault();
                        $("body").addClass("unloading-sub");
                        setTimeout(function(){
                            $(".modal.anim-in").removeClass("anim-in");
                            $(".modal-wrapper").remove();
                        }, 200);    
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
                        //make url readable/shareable
                        
                        history.pushState(null, null, '#' + value);
                        $(".tabs-content *").removeClass("active");
                        $(".tabs-content ." + value).addClass("active");
                    });
                    
                    //direct linking to tabs
                    if (location.hash) {
                        $("a.hash-sub").parent().siblings().removeClass("active");
                        $("a.hash-sub#" + hash).parent().addClass("active");
                        $(".tabs-content *").removeClass("active");
                        $(".tabs-content ." + hash).addClass("active");
                    };
                     
                    // separate animation to new class and remove class after animation duration so no repaint at breakpoints    
                    setTimeout(function(){
                        $(".modal.anim-in").removeClass("anim-in");
                    }, 200);       
                                
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
            }, 0);   
        },

        // ILLUSTRATIONS
        
        '/illustrations': function () {
            pageSetup();
            var thisPageTemplate = base + "/components/page-illustrations.html"
            var thisPageName = "illustrations"
            
            document.title = "Wil Nichols : Illustrations";
            pageChange(thisPageTemplate, thisPageName);
        },
        
        // INDIVIUAL PHOTO
    
        '/photography/:collection': function (params) {
            pageSetup();
            var url = window.location.pathname;
            var filename = url.substring(url.lastIndexOf('/')+1);
            var thisPageName = "photography";
            var thisSubPageName = params.collection;
            var thisPageTemplate = base + "/components/photography/" + thisSubPageName + ".html";
            
            
            document.title = "Wil Nichols : Photography : " + thisSubPageName;
            
            $("body").removeClass("loaded").addClass("photography unloading " + thisPageName + "loading-sub " + thisSubPageName).attr("id", "photography");
            
            console.log(params.collection);
            setTimeout(function(){
                $("a[href='photography/']").parent().addClass("active");
                $.get(thisPageTemplate, function(thisPageContents) {
                    var thisPageMain = $(thisPageContents).filter("#subpage-fragment-album");
                    var thisPageFooter = $(thisPageContents).filter("#footer-fragment-album");
                    var thumbnails = thisPageMain.find("ul.photo-carousel").children().clone();
                    

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
                        $(this).attr("src", base + "/static/img/" + thisPageName + "/" + thisSubPageName + "/sm/" + thisfilename);
                    });
                    $(".load").html(thisPageMain);
                    $("a.navigo-back-to-parent").click(function() {
                        $("body").addClass("unloading-sub");
                        event.preventDefault();
                        router.navigate($(this).attr("href"));
                    });
                    $("body").attr("class", "photography photography-sub loaded-sub " + thisSubPageName); 
                    $("ul.thumbnails li").click(function() {
                        var thisfilename =  $(this).children().attr('alt');
                        //remove all selections
                        $("ul.photo-carousel li").removeClass("active")
                        //active class on main and thumbnail
                        $("ul.photo-carousel li img[alt='" + thisfilename + "']").parent().addClass("active");
                    });                     
                    $("footer .footer-load").html(thisPageFooter);
                    // so when i change .html to .append, the function fires twice. WHY
                    $("body").attr("class", "loaded " + thisPageName);
                });
            }, 0);             
        },            
            

        // PHOTOGRAPHY
        
        '/photography/': function () {
            
            $("body").attr("id", "photography");
            pageSetup();
            var thisPageTemplate = base + "/components/page-photography.html"
            var thisPageName = "photography"
    
            document.title = "Wil Nichols : Photography";
            pageChange(thisPageTemplate, thisPageName);
            $("body").attr("id", "photography");          
        },
        
        // INDIVIUAL PHOTO
        
        // RÉSUMÉ
        
        '/resume/': function () {
            document.title = "Wil Nichols : Résumé";
            pageSetup();
            var thisPageTemplate = base + "/components/page-resume.html"
            var thisPageName = "resume"
            
            pageChange(thisPageTemplate, thisPageName);
        },
        
        // CONTACT
        
        '/contact/': function () {
            document.title = "Wil Nichols : Contact";
            pageSetup();
            var thisPageTemplate = base + "/components/page-contact.html"
            var thisPageName = "contact"
            
            
            pageChange(thisPageTemplate, thisPageName);
            
        },
        
        // LANDING
        
        '/home/': function () { 
            document.title = "Wil Nichols";
            pageSetup();
            var thisPageTemplate = base + "/components/page-index.html";
            var thisPageName = "index";
            pageChange(thisPageTemplate, thisPageName);
            
        },
        '*': function () { 
            window.location = "/home";
        },
    });


$(".load, nav").ajaxComplete(function() {
    $("a[data-navigo]").click(function() {
        event.preventDefault();
        router.navigate($(this).attr("href"));
    });
});