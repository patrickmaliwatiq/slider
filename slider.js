(function ($) {

    var SliderWidget = function (el, opts) {
        var element = $(el);
        var options = opts;
        var isMouseDown = false;
        var startMouseX;
        var lastElemLeft;
        var sliderPosition = 0;

        element.wrap('<div/>')
        var container = $(el).parent();

        container.addClass('slider');

        var dotContainer = $('<div></div>').addClass('dot-container');
        for (var i=0; i < options.itemCount; i++) {
            var dot = $('<div></div>').addClass('dot dot_' + i);
            if (i <= 5) {
                dot.addClass('inFocus');
            }
            dotContainer.append(dot);
        }

        container.append(dotContainer);
        container.append('<div class="slider-line"><div class="slider-button"></div></div>');

        if (typeof(options.width) != 'undefined')
        {
            container.css('width',(options.width+'px'));
        }
        container.find('.slider-line').css('width',(container.width())+'px');

        var startSlide = function (e) {

            isMouseDown = true;
            var pos = getMousePosition(e);
            startMouseX = pos.x;

            lastElemLeft = ($(this).offset().left - $(this).parent().offset().left);
            updateSliderView(e);

            return false;
        };

        var getMousePosition = function (e) {
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

        var updateSliderView = function (e) {
            var pos = getMousePosition(e);

            var spanX = (pos.x - startMouseX);

            var newPos = (lastElemLeft + spanX)
            var upperBound = (container.find('.slider-line').width()-container.find('.slider-button').width());
            newPos = Math.max(0,newPos);
            newPos = Math.min(newPos,upperBound);

            sliderPosition = newPos;

            container.find('.slider-button').css("left", sliderPosition);

            if (typeof(options.onDrop) !== 'undefined') {
                options.onDrop(sliderPosition);
            }
        };

        var updateDotsView = function() {
            var percentage = sliderPosition / options.width;
            var selectedDotIdx = Math.floor(percentage * options.itemCount);

            container.find('.dot.inFocus').removeClass('inFocus');

            var range = [0,0];
            if (selectedDotIdx > options.itemCount - 3) {
                range = [options.itemCount - 3, options.itemCount];
            } else if (selectedDotIdx < 3) {
                range = [0, 5];
            } else {
                range = [selectedDotIdx-2, selectedDotIdx+2];
            }

            for (var j=range[0]; j <= range[1]; j++) {
                var realJ = j;
                var dotFound = container.find('.dot_' + realJ);
                if (dotFound) {
                    dotFound.addClass('inFocus');
                }
            }
        };

        var onMouseMove = function (e) {
            if(isMouseDown){
                updateSliderView(e);
                updateDotsView();
                return false;
            }
        };

        var onMouseUp = function (e) {
            isMouseDown = false;
        };

        container.find('.slider-button').bind('mousedown',startSlide);

        $(document).mousemove(function(e) { onMouseMove(e); });
        $(document).mouseup(function(e){ onMouseUp(e); });

    };

    /*******************************************************************************************************/

    $.fn.Slider = function (options) {
        return this.each(function () {
            new SliderWidget($(this), options || {});
        });
    }

})(jQuery);

$( document ).ready(function() {
    var width = 400;
    var itemCount = 25;
    var callback = function(x) {
        var scrollValue = (x/width);
        var totalWidth = $('.phone').width() * itemCount;
        $('.phone-container').scrollLeft((scrollValue * totalWidth))
    }
    $("#slider1").Slider({width: width, itemCount: itemCount, onDrop: callback});
});
