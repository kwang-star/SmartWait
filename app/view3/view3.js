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
    var content = [];

    let data = JSON.stringify($scope.fields);
    let url = "http://localhost:8081/demo/req_patient.php";
    $http.post(url, data)
    .then(function (response){
        content = response.data;
      
        if (content.status == 1)
        {
          alert(content.msg);
          $scope.fields = {};
        }
        else
        {
          alert("Submission Failed. Please contact administrator.");
        }
      }
    );
  };
}]);