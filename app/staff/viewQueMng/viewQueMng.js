'use strict';
var app = angular.module('staffApp.viewQueMng', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/staff/viewQueMng', {
    templateUrl: 'staff/viewQueMng/viewQueMng.html',
    controller: 'viewQueMngCtrl'
  });
}])

.controller('viewQueMngCtrl', ['$scope', '$http', function($scope, $http) {  
  $scope.queueFlag = false;
  getQueueStatus(); //Check Queue Status
  $scope.fields = {};
  //Future improvement: Store list of doctors in database.
  $scope.doctors = ["Dr. A", "Dr. B", "Dr. C"];
  $scope.doc_stat = {};
  $scope.doctors.forEach (initDocStat);

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
        console.log(content.value);
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
        
        if (content.status == 1)
        {
          $scope.doc_stat[doc]["patient"] = content.patId;
          console.log($scope.doc_stat);
        }
        else if (content.status == 0)
        {
          alert(content.msg);
          initDocStat(doc);
        }
      }
    );
  };

}]);