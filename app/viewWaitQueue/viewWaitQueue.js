'use strict';

angular.module('myApp.viewWaitQueue', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewWaitQueue', {
    templateUrl: 'viewWaitQueue/viewWaitQueue.html',
    controller: 'viewWaitQueueCtrl'
  });
}])

.controller('viewWaitQueueCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {  
  $scope.queueFlag = false;
  getQueueStatus(); //Check Queue Status
  $scope.queues = {};
  //Future improvement: Store list of doctors in database.
  $scope.doctors = ["Dr. A", "Dr. B", "Dr. C"];
  $scope.doctors.forEach(getQueue);

  //Start interval
  //Future improvement: 
  // Performance: Start/Stop interval when this page is in/out of view
  var interval = $interval(refresh_queue, 5 * 1000);

  //Get Queue Status
  //Future Improvement: Make this global or in one file since other ctrls use this as well
  function getQueueStatus() 
  {
    let query = "status=1";
    let url = "http://localhost:8081/demo/queue.php" + "?" + query;
    $http.get(url)
    .then(function (response){
        let content = response.data;

        if (content.value == 0)
        {
          $scope.queueFlag = false;
        }
        else if (content.value == 1)
        {
          $scope.queueFlag = true;
        }
      }
    );
  };

  //Get Specific Queue Info
  function getQueue(doc) 
  {
    let query = "doctor=" + doc;
    let url = "http://localhost:8081/demo/queue.php" + "?" + query;
    $http.get(url)
    .then(function (response){
        let content = response.data;
        $scope.queues[doc] = content;
        // console.log( $scope.queues);
      }
    );
  };

  function refresh_queue() {
    console.log("in fnc");
    $scope.doctors.forEach(getQueue);
  }
}]);