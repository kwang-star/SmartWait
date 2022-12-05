'use strict';
var app = angular.module('staffApp.viewQueMng', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/staff/viewQueMng', {
    templateUrl: 'staff/viewQueMng/viewQueMng.html',
    controller: 'viewQueMngCtrl'
  });
}])

.controller('viewQueMngCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {  
  $scope.queueFlag = false;
  getQueueStatus(); //Check Queue Status
  //Future improvement: Store list of doctors in database.
  $scope.doctors = ["Dr. A", "Dr. B", "Dr. C"];
  $scope.doc_stat = {};
  $scope.doctors.forEach (initDocStat);

  //Start intervals 
  //Future Improvement: 
  //Performance: Make interval only occur in one location OR refresh appt on
  //              change to appt queue.
  var interval = $interval(refresh_appt, 15 * 60 *1000);

  //Future Improvement: Store info about current patient seeing doctor in db
  function initDocStat(doc)
  {
    $scope.doc_stat[doc] = 
    {
      "patient" : ""
    };
  }

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
          $scope.queueFlag = false;
        }
        else if (content.value == 1)
        {
          $scope.queueFlag = true;
        }
      }
    );
  };

  //Start Queue
  $scope.submitStart = function() 
  {
    var content = [];
    
    let data = { "cmd":"start" };
    data = JSON.stringify(data);
    let url = "http://localhost:8081/demo/queue.php";
    $http.post(url, data)
    .then(function (response){
        content = response.data;
        alert(content.msg);

        if (content.status == 1)
        {
          $scope.queueFlag = true;
          $scope.doctors.forEach (initDocStat);
        }
      }
    );
  };

  //End Queue
  $scope.submitEnd = function() 
  {
    var content = [];

    let data = { "cmd":"end" };
    data = JSON.stringify(data);
    let url = "http://localhost:8081/demo/queue.php";
    $http.post(url, data)
    .then(function (response){
        content = response.data;
        alert(content.msg);

        if (content.status == 1)
        {
          $scope.queueFlag = false;
          $scope.doctors.forEach (initDocStat);
        }
      }
    );
  };

  //Next Queue
  $scope.submitNext = function(doc) 
  {
    var content = [];

    let data = { 
      "cmd":    "next",
      "doctor": doc
    };
    data = JSON.stringify(data);
    let url = "http://localhost:8081/demo/queue.php";
    $http.post(url, data)
    .then(function (response){
        content = response.data;
        alert(content.msg);

        if (content.status == 1)
        {
          $scope.doc_stat[doc]["patient"] = content.patId;
        }
        else if (content.status == 0)
        {
          initDocStat(doc);
        }
      }
    );
  };

  //Refresh Appt List
  function refresh_appt() {
    var content = [];
    let data = {
      "cmd": "refresh_appts"
    }

    data = JSON.stringify(data);
    let url = "http://localhost:8081/demo/queue.php";
    $http.post(url, data)
    .then(function (response){
        content = response.data;
        alert(content.msg);

        if (content.status == 1)
        {
          $scope.initFlag = true;
        }
      }
    );
  }

}]);