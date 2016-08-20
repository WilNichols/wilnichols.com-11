var hoverTimeout;
var palette = [ 'a', 'b', 'c', 'd', 'e', 'f' ][Math.floor(Math.random()*6)];
var url = $(this).attr("href");

function pageSetup () {
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
    $(document).ready(function() {
        console.log("DOM READY");
    });

}
function pageChange (thisPageMain, thisPageName, thisPageFooter){
    $("body").removeClass("loaded").addClass("loading").attr("id", palette);
    console.log(thisPageName);
    setTimeout(function(){
        $("nav ul a").parent().removeClass("active");
        $("a[href='" + thisPageName + "']").parent().addClass("active");
        $("footer .footer-load *").remove();
        $(".load").load(thisPageMain, function() {
            $("body").attr("class", "loaded " + thisPageName);
        });
        $("footer .footer-load").load(thisPageFooter);
    }, 250); 
}


var router = new Navigo(root=null, useHash=false);



    router.on({
        
        // PRODUCTS 
        
        '/products': function () {
            pageSetup();
            console.log("Products Page");
            
            $("body").attr("class", "products");
            
            $("nav ul a").parent().removeClass("active");
            $("a[href='products']").parent().addClass("active");
        },
        
        // ILLUSTRATIONS
        
        '/illustrations': function () {
            pageSetup();
            console.log("Illustrations Page");    
            $("body").attr("class", "illustrations");
            $("nav ul a").parent().removeClass("active");
            $("a[href='illustrations']").parent().addClass("active");
        },
        
        // INDIVIUAL PHOTO
    
        'photography/:collection': function (params) {
            pageSetup();
            var url = window.location.pathname;
            var filename = url.substring(url.lastIndexOf('/')+1);
            var thisPageName = "photography";
            var thisSubPageName = params.collection;
            var thisPageMain = "/components/" + thisPageName + "/" + thisSubPageName + ".html #pagejs-load-in-sub";
            var thisPageFooter = "/components/page-" + thisPageName + ".html #pagejs-footer-in";
            var children = $("ul.grid").attr("data-children");
            
            $("body").removeClass("loaded").addClass("photography unloading " + thisPageName + "loading-sub " + thisSubPageName).attr("id", "photography");
            
            console.log(params.collection);
            
            // TO-DO: Automate. fill <li> with image path using collection param, filenames per order and number of <li>. Example: fifth empty li is filled w/ "<img src="static/img/photography/:collection/:li-number.jpg" />
            // TO-DO: If referrer is /photography, hard-set back button to go to /photog route
            setTimeout(function(){
                $("a[href='" + thisPageName + "']").parent().addClass("active");
                $("footer .footer-load *").remove();
                $(".load").load(thisPageMain, function() {
                    $("body").attr("class", "photography photography-sub loaded-sub " + thisSubPageName); 
                    $("ul.thumbs li").click(function() {
                        console.log("CLICKED YO");
                        $("img.masthead").attr("src", $(event.target).attr("src"));
                        $("ul.thumbs li").removeClass("active");
                        $(event.target).parent().addClass("active");
                    }); 
                    $("ul.thumbs li").mouseover(function() {
                        console.log("so why does hover css take long and this doesn't");
                    });
                });
                $("footer .footer-load").load(thisPageFooter);
            }, 250); 
            
            //TO-DO: on images taller than calc(100vh - 3rem), addclass(portrait) & add height toggle button. if this.height > calc(100vh-3rem) apprend "a.heighttoggle" // .portrait a.heighttoggle.onclick, addclass portrait-scaled (w/ according css) removeclass(portrait) // .portrait-scaled a.heighttogggle.onclick, removeclass portrait-scaled addclass portrait
            
            
        },
         
        // PHOTOGRAPHY
        
        '/photography': function () {
            pageSetup();
            var thisPageMain = "components/page-photography.html #pagejs-load-in"
            var thisPageFooter = "components/page-photography.html #pagejs-footer-in"
            var thisPageName = "photography"
    
            
            $("body").removeClass("loaded").addClass("loading").attr("id", "photography");
            console.log(thisPageName);
            setTimeout(function(){
                $("nav ul a").parent().removeClass("active");
                $("a[href='" + thisPageName + "']").parent().addClass("active");
                $("footer .footer-load *").remove();
                $(".load").load(thisPageMain, function() {
                    $("body").attr("class", "loaded " + thisPageName);
                });
                $("footer .footer-load").load(thisPageFooter);
            }, 250); 
            
        },
        
    
        
        // RÉSUMÉ
        
        '/resume': function () {
            pageSetup();
            var thisPageMain = "components/page-resume.html #pagejs-load-in"
            var thisPageFooter = "components/page-resume.html #pagejs-footer-in"
            var thisPageName = "resume"
            
            pageChange(thisPageMain, thisPageName, thisPageFooter);
        },
        
        // CONTACT
        
        '/contact': function () {
            pageSetup();
            var thisPageMain = "components/page-contact.html #pagejs-load-in"
            var thisPageFooter = "components/page-contact.html #pagejs-footer-in"
            var thisPageName = "contact"
            
            
            pageChange(thisPageMain, thisPageName, thisPageFooter);
            
        },
        
        // LANDING
        
        '/home': function () { 
            pageSetup();
            var thisPageMain = "components/page-index.html";
            var thisPageFooter = "";
            var thisPageName = "index";
            pageChange(thisPageMain, thisPageName, thisPageFooter);
            
        },
        '*': function () { 
            window.location = "/home";
        },
    });
