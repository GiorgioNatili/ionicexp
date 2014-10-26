angular.module('sociallife.directives', [])


.directive('zoomable', function(ScrollRender, $ionicLoading) {
    return {
        link: function(scope, element, attrs) {

            $ionicLoading.show({template: 'Caricamento...'});

            element.bind('load', function() {

                // Intialize layout
                var container = document.getElementById("truck-container");
                var content = document.getElementById("truck-content");
                var clientWidth = 0;
                var clientHeight = 0;
                var isZooming;

                // Initialize scroller
                var scroller = new Scroller(ScrollRender.render(content), {
                    scrollingX: true,
                    scrollingY: true,
                    animating: true,
                    bouncing: true,
                    locking: true,
                    zooming: true,
                    minZoom: 0.5,
                    maxZoom: 2
                });

                var image = document.getElementById('image-scrollable');
                var contentWidth = image.width;
                var contentHeight = image.height;

                console.log(contentWidth, contentHeight)
                $ionicLoading.hide();
                // Initialize scrolling rect
                var rect = container.getBoundingClientRect();
                scroller.setPosition((-contentWidth/2), (-contentHeight/2));

                // Reflow handling
                var reflow = function() {
                    clientWidth = container.clientWidth;
                    clientHeight = container.clientHeight;
                    scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);

                };

                window.addEventListener("resize", reflow, false);
                reflow();

                if ('ontouchstart' in window) {

                    container.addEventListener("touchstart", function(e) {

                        if(e.touches.length == 2){

                          isZooming = true;


                        } else {

                          // Don't react if initial down happens on a form element
                          if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
                            return;
                          }

                          scroller.doTouchStart(e.touches, e.timeStamp);

                        }

                        e.preventDefault();
                    }, false);

                    document.addEventListener("touchmove", function(e) {
                        if(!isZooming){
                          scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
                        }
                    }, false);

                    document.addEventListener("touchend", function(e) {
                        if(!isZooming){
                          scroller.doTouchEnd(e.timeStamp);
                        }
                        if(isZooming){
                          isZooming = false;
                        }

                    }, false);

                    document.addEventListener("touchcancel", function(e) {
                        if(!isZooming){
                          scroller.doTouchEnd(e.timeStamp);
                        }
                        if(isZooming){
                          isZooming = false;
                        }
                    }, false);

                } else {

                    var mousedown = false;

                    container.addEventListener("mousedown", function(e) {
                        if (e.target.tagName.match(/input|textarea|select/i)) {
                            return;
                        }

                        scroller.doTouchStart([{
                            pageX: e.pageX,
                            pageY: e.pageY
                        }], e.timeStamp);

                        mousedown = true;
                    }, false);

                    document.addEventListener("mousemove", function(e) {
                        if (!mousedown) {
                            return;
                        }

                        scroller.doTouchMove([{
                            pageX: e.pageX,
                            pageY: e.pageY
                        }], e.timeStamp);

                        mousedown = true;
                    }, false);

                    document.addEventListener("mouseup", function(e) {
                        if (!mousedown) {
                            return;
                        }

                        scroller.doTouchEnd(e.timeStamp);

                        mousedown = false;
                    }, false);

                    container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel", function(e) {
                        scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
                    }, false);
                }
            });
        }
    };
})
  .directive('pinchZoom', function() {
    var _directive =  {
      restrict : 'A',
      scope    : false,
      link     : _link
    };

    function _link(scope, element, attrs) {

      var elWidth = element[0].offsetWidth;
      var elHeight = element[0].offsetHeight;

      var mode = '';

      var distance = 0;
      var initialDistance = 0;

      var scale = 1;
      var relativeScale = 1;
      var initialScale = 1;
      var MAX_SCALE = 3;

      var positionX = 0;
      var positionY = 0;

      var initialPositionX = 0;
      var initialPositionY = 0;

      var originX = 0;
      var originY = 0;

      var startX = 0;
      var startY = 0;
      var moveX = 0;
      var moveY = 0;

      element.css({
        '-webkit-transform-origin' : '0 0',
        'transform-origin'         : '0 0'
      });

      element.on('touchstart', function(evt) {
        startX = evt.touches[0].pageX;
        startY = evt.touches[0].pageY;
        initialPositionX = positionX;
        initialPositionY = positionY;
        moveX = 0;
        moveY = 0;
        mode = '';

        if (evt.touches.length === 2) {

          initialScale = scale;
          initialDistance = getDistance(evt);
          originX = evt.touches[0].pageX -
            parseInt((evt.touches[0].pageX - evt.touches[1].pageX) / 2, 10) -
            element[0].offsetLeft - initialPositionX;
          originY = evt.touches[0].pageY -
            parseInt((evt.touches[0].pageY - evt.touches[1].pageY) / 2, 10) -
            element[0].offsetTop - initialPositionY;

        }
      });

      element.on('touchmove', function(evt) {
        evt.preventDefault();

        if (mode === 'swipe' && scale > 1) {

          moveX = evt.touches[0].pageX - startX;
          moveY = evt.touches[0].pageY - startY;

          positionX = initialPositionX + moveX;
          positionY = initialPositionY + moveY;

          transformElement();

        } else if (mode === 'pinch') {

          distance = getDistance(evt);
          relativeScale = distance / initialDistance;
          scale = relativeScale * initialScale;

          positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
          positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

          transformElement();

        } else {

          if (evt.touches.length === 1) {
            mode = 'swipe';
          } else if (evt.touches.length === 2) {
            mode = 'pinch';
          }

        }

        transformElement();
      });

      element.on('touchend', function(evt) {

        if (mode === 'pinch') {

          if (scale < 1) {

            scale = 1;
            positionX = 0;
            positionY = 0;

          } else if (scale > MAX_SCALE) {

            scale = MAX_SCALE;
            relativeScale = scale / initialScale;
            positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
            positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

          }

        }

        if (scale > 1) {

          if (positionX > 0) {
            positionX = 0;
          } else if (positionX < elWidth * (1 - scale)) {
            positionX = elWidth * (1 - scale);
          }
          if (positionY > 0) {
            positionY = 0;
          } else if (positionY < elHeight * (1 - scale)) {
            positionY = elHeight * (1 - scale);
          }

        }

        transformElement(0.1);
      });

      function getDistance(evt) {
        var d = Math.sqrt(Math.pow(evt.touches[0].pageX - evt.touches[1].pageX, 2) +
          Math.pow(evt.touches[0].pageY - evt.touches[1].pageY, 2));
        return parseInt(d, 10);
      }

      function transformElement(duration) {
        var transition  = duration ? 'all cubic-bezier(0,0,.5,1) ' + duration + 's' : '',
          matrixArray = [scale, 0, 0, scale, positionX, positionY],
          matrix      = 'matrix(' + matrixArray.join(',') + ')';

        element.css({
          '-webkit-transition' : transition,
          'transition'         : transition,
          '-webkit-transform'  : matrix + ' translate3d(0,0,0)',
          'transform'          : matrix
        });
      }
    }
    return _directive;
  });
