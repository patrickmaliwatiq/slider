(function ($) {

    var PPSliderClass = function (el, opts) {
        var element = $(el);
        var options = opts;
        var isMouseDown = false;
        var currentVal = 0;

        element.wrap('<div/>')
        var container = $(el).parent();

        container.addClass('pp-slider');
        container.addClass('clearfix');

        var dotContainer = $('<div></div>').addClass('dot-container');
        for (var i=0; i < options.itemCount; i++) {
            var dot = $('<div></div>').addClass('dot dot_' + i);
            dotContainer.append(dot);
        }

        container.append(dotContainer);
        container.append('<div class="pp-slider-scale"><div class="pp-slider-button"></div></div>');

        if (typeof(options.width) != 'undefined')
        {
            container.css('width',(options.width+'px'));
        }
        container.find('.pp-slider-scale').css('width',(container.width())+'px');

        var startSlide = function (e) {

            isMouseDown = true;
            var pos = getMousePosition(e);
            startMouseX = pos.x;

            lastElemLeft = ($(this).offset().left - $(this).parent().offset().left);
            updatePosition(e);

            return false;
        };

        var getMousePosition = function (e) {
            //container.animate({ scrollTop: rowHeight }, options.scrollSpeed, 'linear', ScrollComplete());
            var posx = 0;
            var posy = 0;

            if (!e) var e = window.event;

            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            }
            else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
            }

            return { 'x': posx, 'y': posy };
        };

        var updatePosition = function (e) {
            var pos = getMousePosition(e);

            var spanX = (pos.x - startMouseX);

            var newPos = (lastElemLeft + spanX)
            var upperBound = (container.find('.pp-slider-scale').width()-container.find('.pp-slider-button').width());
            newPos = Math.max(0,newPos);
            newPos = Math.min(newPos,upperBound);
            currentVal = Math.round((newPos/upperBound)*100,0);

            container.find('.pp-slider-button').css("left", newPos);

            var percentage = newPos / options.width;
            var selectedDotIdx = Math.round(percentage * options.itemCount);

//            var foo  = container.find('dot_' + selectedDotIdx);
//            console.log('Selected Dot: ', foo);

            container.find('.dot.inFocus').removeClass('inFocus');
            for (var j=selectedDotIdx-2; j <= selectedDotIdx + 2; j++) {
                var realJ = j;
                if (j < 0) {
                    realJ = 0;
                }
                var dotFound = container.find('.dot_' + realJ);
                if (dotFound) {
                    dotFound.addClass('inFocus');
                }
            }

            opts.onDrop(newPos);
        };

        var moving = function (e) {
            if(isMouseDown){
                updatePosition(e);
                return false;
            }
        };

        var dropCallback = function (e) {
            isMouseDown = false;
            element.val(currentVal);
            if(typeof element.options != 'undefined' && typeof element.options.onChanged == 'function'){
                element.options.onChanged.call(this, null);
            }
        };

        container.find('.pp-slider-button').bind('mousedown',startSlide);

        $(document).mousemove(function(e) { moving(e); });
        $(document).mouseup(function(e){ dropCallback(e); });

    };

    /*******************************************************************************************************/

    $.fn.PPSlider = function (options) {
        var opts = $.extend({}, $.fn.PPSlider.defaults, options);

        return this.each(function () {
            new PPSliderClass($(this), opts);
        });
    }

    $.fn.PPSlider.defaults = {
        width: 150
    };


})(jQuery);

$( document ).ready(function() {
    var width = 400;
    var itemCount = 25;
    var callback = function(x) {
//        console.log("Value of x is: " , x/width);
        var scrollValue = (x/width);
        var totalWidth = $('.phone').width() * itemCount;
        $('.phone-container').scrollLeft((scrollValue * totalWidth))
    }
    $("#slider1").PPSlider({width: width, itemCount: 25, onDrop: callback});
});
