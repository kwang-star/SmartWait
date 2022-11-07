'use strict';
var app = angular.module('myApp.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])

.controller('View3Ctrl', ['$scope', '$http', function($scope, $http) {  
  $scope.genders = ["M", "F"];
  $scope.currentDate = new Date();
  $scope.fields = {};
  $scope.submit = function() 
  {
    // Incomplete Exploration of HTTP with AngularJS
    let data = JSON.stringify($scope.fields);
    let url = "http://localhost:8081/demo/test.php";
    $http.post(url, data)
    .then(function (response){
        $scope.content = response.data;
      }
    );
    alert("Form Submitted with" + JSON.stringify($scope.fields));
    // console.log("Response" + $scope.content);
    $scope.fields = {};
  };
}]);