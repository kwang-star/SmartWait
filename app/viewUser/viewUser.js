'use strict';
var app = angular.module('myApp.viewUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewUser', {
    templateUrl: 'viewUser/viewUser.html',
    controller: 'viewUserCtrl'
  });
}])

.controller('viewUserCtrl', ['$scope', '$http', function($scope, $http) {  
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
          alert("Submission Failed. Try again."
          + "\n If reoccuring, please contact administrator.");
        }
      }
    );
  };
}]);