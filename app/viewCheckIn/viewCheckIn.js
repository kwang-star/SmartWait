'use strict';
var app = angular.module('myApp.viewCheckIn', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewCheckIn', {
    templateUrl: 'viewCheckIn/viewCheckIn.html',
    controller: 'viewCheckInCtrl'
  });
}])

.controller('viewCheckInCtrl', ['$scope', '$http', function($scope, $http) {  
  $scope.startFlag = false;
  getQueueStatus(); //Check Queue Status
  $scope.initFlag = true;
  $scope.fields = {};
  //Future improvement: Store list of doctors in database.
  $scope.doctors = ["Dr. A", "Dr. B", "Dr. C"];

  //Appointment Checkin
  $scope.submitAppt = function() 
  {
    var content = [];

    $scope.fields.cmd = "add_appt";
    let data = JSON.stringify($scope.fields);
    let url = "http://localhost:8081/demo/queue.php";
    $http.post(url, data)
    .then(function (response){
        content = response.data;
        alert(content.msg);

        if (content.status == 1)
        {
          $scope.fields = {};
          $scope.initFlag = true;
        }
      }
    );
  };

  //Walk In Check In
  $scope.submitWalkIn = function() 
  {
    var content = [];

    $scope.fields.cmd = "add_walkin";
    let data = JSON.stringify($scope.fields);
    let url = "http://localhost:8081/demo/queue.php";
    $http.post(url, data)
    .then(function (response){
        content = response.data;
        alert(content.msg);

        if (content.status == 1)
        {
          $scope.fields = {};
          $scope.initFlag = true;
        }
      }
    );
  };

  //Get Queue Status
  function getQueueStatus() 
  {
    let query = "status=1";
    let url = "http://localhost:8081/demo/queue.php" + "?" + query;
    $http.get(url)
    .then(function (response){
        let content = response.data;

        if (content.value == 0)
        {
          $scope.startFlag = false;
        }
        else if (content.value == 1)
        {
          $scope.startFlag = true;
        }
      }
    );
  };

}]);