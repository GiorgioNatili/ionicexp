angular.module('sociallife.services', [])

/**
 * Service returning the news loading an external JSON.
 */
.factory('News', function($http) {

   var news = [];

  // Might use a resource here that returns a JSON array
  $http.get('data/news.json').then(function(res){

      res.data.forEach(function(item){

          if(item.isActive === true){

              news.push(item);

          }

      });

  });

  return {
    all: function() {
      return news;
    },
    get: function(id) {
      // Simple index lookup
        debugger
      return news[id];
    }
  }
})
