'use strict';
var app = angular.module('myApp.viewCheckIn', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewCheckIn', {
    templateUrl: 'viewCheckIn/viewCheckIn.html',
    controller: 'viewCheckInCtrl'
  });
}])

.controller('viewCheckInCtrl', ['$scope', '$http', function($scope, $http) {  
  $scope.startFlag = true;
  $scope.fields = {};
  //Future improvement: Store list of doctors in database.
  $scope.doctors = ["Dr. A", "Dr. B", "Dr. C"];


  $scope.submitAppt = function() 
  {

  };

  $scope.submitWalkIn = function() 
  {
    
  };

}]);