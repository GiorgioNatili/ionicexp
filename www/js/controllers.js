angular.module('sociallife.controllers', [])

.controller('DashCtrl', function($scope) {

})

.controller('NewsCtrl', function($scope, Links) {
  $scope.links = Links.all();
})

.controller('NewsDetailCtrl', function($scope, $stateParams, Links) {
  $scope.friend = Links.get($stateParams.friendId);
})

.controller('CommissariatoCtrl', function($scope) {
});
