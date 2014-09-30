angular.module('sociallife.controllers', ['ionic'])

.controller('DashCtrl', function($scope, $ionicPopup) {

    var URLS = {

        facebook:       'https://www.facebook.com/unavitadasocial?fref=ts',
        youtube:        'https://www.youtube.com/results?q=una+vita+da+social',
        commissariato:  ''

    };

    var alertPopup, currentURL;

    $scope.openURL = function(item){

        if(URLS[item] !== ''){

          currentURL = window.open(URLS[item], '_blank', 'location=no');

        }else{

          alertPopup = $ionicPopup.alert({
            title: 'Attenzione!',
            template: 'Link attualmente non attivo...'
          });

        }

    };

})

.controller('NewsCtrl', function($scope, News) {
  $scope.news = News.all();
})

.controller('NewsDetailCtrl', function($scope, $stateParams, News) {
        alert('controller')
  $scope.news = News.get($stateParams.id);
})

.controller('TruckCtrl', function($scope) {
});
