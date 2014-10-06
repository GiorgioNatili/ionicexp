angular.module('sociallife.controllers', ['ionic'])

.controller('DashCtrl', function($scope, $ionicPopup, $ionicNavBarDelegate) {

    $scope.hideBackButton = true;
    
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

  $scope.hideBackButton = false;
  $scope.news = News.all();

})

.controller('BackBarCtrl', function($scope, $ionicNavBarDelegate){

  $scope.goBack = function() {
    
      $ionicNavBarDelegate.back();
  
    };

})

.controller('NewsDetailCtrl', function($scope, $stateParams, News) {

  $scope.item = News.get($stateParams.newsId);

  $scope.openDetails = function($event){
    
    $event.preventDefault();
    window.open($event.currentTarget.attributes.href.value, '_blank', 'location=no');

  };
  
})

.controller('TruckCtrl', function($scope) {

  $scope.hideBackButton = false;

});
