'use strict';
var app = angular.module('myApp.viewCheckIn', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewCheckIn', {
    templateUrl: 'viewCheckIn/viewCheckIn.html',
    controller: 'viewCheckInCtrl'
  });
}])

.controller('viewCheckInCtrl', ['$scope', '$http', function($scope, $http) {  
}]);