angular.module('sociallife.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Links', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var links = [
    { id: 0, name: 'facebook', value: 'https://www.facebook.com/unavitadasocial', type: 'external' },
    { id: 1, name: 'youtube', value: 'http://www.youtube.com/results?search_query=una+vita+da+social', type: 'external' },
    { id: 2, name: 'news', value: 'http://www.commissariatodips.it/notizie.html', type: 'external'},
    { id: 3, name: 'commissariato', value: 'http://www.commissariatodips.it', type: 'external'},
    { id: 3, name: 'opuscolo', value: 'assets/opuscolo.pdf', type: 'internal'}
  ];

  return {
    all: function() {
      return links;
    },
    get: function(id) {
      // Simple index lookup
      return links[id];
    }
  }
});
