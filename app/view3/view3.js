'use strict';
var app = angular.module('myApp.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])

.controller('View3Ctrl', ['$scope', function($scope, $filter) {  
  $scope.genders = ["M", "F"];
  $scope.currentDate = new Date();
  $scope.fields = {};
  $scope.submit = function() 
  {
    alert("Form Submitted with" + JSON.stringify($scope.fields));
    $scope.fields = {};
  };
}]);