'use strict';

angular.module('staffApp.patReq', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/staff/patReq', {
    templateUrl: 'staff/patReq/patReq.html',
    controller: 'patReqCtrl'
  });
}])

.factory('myService', function ($http) {
  return {
    getServerCall: function (url) {
      return $http.get(url).then(function (response) {
        console.log(url + " " + JSON.stringify(response.data));
        return response.data;
      });
    },
    postServerCall: function (url, data) {
      return $http.post(url, data).then(function (response) {
        console.log(url + " " + JSON.stringify(response.data));
        return response.data;
      });
    },
  };
})

.controller('patReqCtrl', ['$scope', 'myService', function($scope, myService) {
  //Get List of Patient Requests
  $scope.reqList = [];
  let url = "http://localhost:8081/demo/req_patient.php";
  myService.getServerCall(url).then(function (result) {
                $scope.reqList = result;
              });

  //Approve patient request
  $scope.approve = function(patReq, index) 
  {
    let url = "";

    //Create patient account for patient then remove patient request
    url = "http://localhost:8081/demo/patient.php";
    myService.postServerCall(url, patReq).then(function (res) {
      if (res.status == 0)
      {
        console.log("Approving Registration Failed");
        return;
      }
      
      alert(res.msg);
      //Remove patient request
      removePatReq(patReq, index) 
    });
  };

  //Reject patient request
  $scope.reject = function(patReq, index) 
  {
    //Remove patient request
    removePatReq(patReq, index) 
  };

  function removePatReq(patReq, index) 
  {
    //Remove patient request
    let url = "http://localhost:8081/demo/del_patient_req.php";
    myService.postServerCall(url, patReq).then(function (res) {
      if (res.status == 0)
      {
        console.log("Deleting Registration Failed, Be careful of duplicate approvals for same user.");
        return;
      }
      else if (res.status == 1)
      {
        //remove from table view
        $scope.reqList.splice(index, 1);
      }
    });
  };
}]);