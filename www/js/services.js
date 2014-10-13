angular.module('sociallife.services', [])

.service('ScrollRender', function() {
    this.render = function(content) {
        return (function(global) {

            var docStyle = document.documentElement.style;

            var engine;
            if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
                engine = 'presto';
            } else if ('MozAppearance' in docStyle) {
                engine = 'gecko';
            } else if ('WebkitAppearance' in docStyle) {
                engine = 'webkit';
            } else if (typeof navigator.cpuClass === 'string') {
                engine = 'trident';
            }

            var vendorPrefix = {
                trident: 'ms',
                gecko: 'Moz',
                webkit: 'Webkit',
                presto: 'O'
            }[engine];

            var helperElem = document.createElement("div");
            var undef;

            var perspectiveProperty = vendorPrefix + "Perspective";
            var transformProperty = vendorPrefix + "Transform";

            if (helperElem.style[perspectiveProperty] !== undefined) {

                return function(left, top, zoom) {
                    content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
                };

            } else if (helperElem.style[transformProperty] !== undef) {

                return function(left, top, zoom) {
                    content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
                };

            } else {

                return function(left, top, zoom) {

                    content.style.marginLeft = left ? (-left / zoom) + 'px' : '';
                    content.style.marginTop = top ? (-top / zoom) + 'px' : '';
                    content.style.zoom = zoom || '';
                };

            }
        })(this);
    };

})

/**
 * Service returning the news loading an external JSON.
 */
.factory('News', function($http, $ionicLoading) {

   var news = [];
   $ionicLoading.show({template: 'Caricamento...'});

  // Might use a resource here that returns a JSON array
  $http.get('data/news.json').then(function(res){

      res.data.forEach(function(item){

          if(item.isActive === true){

              news.push(item);

          }

      });

      $ionicLoading.hide()

  });

  return {
    all: function() {
      return news;
    },
    get: function(id) {
      // Simple index lookup
      var value;

      for(var i=0, tot=news.length; i<tot; i++){
        
        if(news[i].id == id){

          value = news[i];
          break;

        }

      }
      return value;
    }
  };
})

.factory('Places', function($http, $ionicLoading, $ionicPopup) {

    var departments = [];
    $ionicLoading.show({template: 'Caricamento...'});

    // Might use a resource here that returns a JSON array

    $http.get('data/compartimenti.json').then(function(res){

        res.data.forEach(function(item){

            departments.push(item);

        });

        $ionicLoading.hide();

    });

    return {

      all: function (){

        return departments;

      },

      get: function(id){

        var value;
        var ids = id.split('.');
        var region, province, office;

        try {

          region = departments.filter(function (element) {

            return element.nome == ids[0];

          });

          if (region) {

            province = region[0].province.filter(function (element) {

              return element.nome == ids[1];

            });

          }

          if (province) {

            office = province[0].dipartimenti.filter(function (element) {

              return element.nome == ids[2];

            });

            value = office[0];

          }

        }catch(error){

          value = {};
          $ionicPopup.alert({
            title: 'Attenzione!',
            template: 'Errore nel caricamento dei dati...'
          });

        }

        return value;

      }

    };
});


