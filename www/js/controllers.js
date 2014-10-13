angular.module('sociallife.controllers', ['ionic'])

  .controller('DashCtrl', function ($scope, $ionicPopup, $ionicNavBarDelegate) {

    $scope.hideBackButton = true;

    var networkState;
    navigator.connection ? networkState = navigator.connection.type : networkState = 'Cell generic connection'

    if (networkState != 'No network connection' && networkState != 'Unknown connection') {

      var URLS = {

        facebook: 'https://www.facebook.com/unavitadasocial?fref=ts',
        youtube: 'https://www.youtube.com/results?q=una+vita+da+social'

      };

      var alertPopup, currentURL;

      $scope.openURL = function (item) {

        if (URLS[item] !== '') {

          currentURL = window.open(URLS[item], '_blank', 'location=no');

        } else {

          alertPopup = $ionicPopup.alert({
            title: 'Attenzione!',
            template: 'Link attualmente non attivo...'
          });

        }

      };

    } else {

      $ionicPopup.alert({
        title: 'Attenzione!',
        template: 'Questa app per essere utilizzata appieno ha bisogno di una connessione internet attiva...'
      });

    }

  })

  .controller('NewsCtrl', function ($scope, News) {

    $scope.hideBackButton = false;
    $scope.news = News.all();

  })

  .controller('NewsDetailCtrl', function ($scope, $stateParams, News) {

    $scope.item = News.get($stateParams.newsId);

    $scope.openDetails = function ($event) {

      $event.preventDefault();
      window.open($event.currentTarget.attributes.href.value, '_blank', 'location=no');

    };

  })

  .controller('TruckCtrl', function ($scope) {

    $scope.hideBackButton = false;

  })

  .controller('CommissariatoCtrl', function ($scope, Places) {

    $scope.hideBackButton = false;
    $scope.departments = Places.all();

    $scope.openDetails = function ($event) {

      window.location = $event.target.dataset.info;

    };

    $scope.callPlace = function ($event) {

      setTimeout('window.location="tel:' + $event.target.dataset.tel + '";', 120);

    };

  })

  .controller('CommissariatoDetailCtrl', function ($scope, $stateParams, Places) {

    $scope.item = Places.get($stateParams.officeId);

  })

  .controller('BackBarCtrl', function ($scope, $ionicNavBarDelegate) {

    $scope.goBack = function () {

      $ionicNavBarDelegate.back();

    };

  });