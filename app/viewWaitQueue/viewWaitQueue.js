'use strict';

angular.module('myApp.viewWaitQueue', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewWaitQueue', {
    templateUrl: 'viewWaitQueue/viewWaitQueue.html',
    controller: 'viewWaitQueueCtrl'
  });
}])

.controller('viewWaitQueueCtrl', ['$scope', function($scope) {
}]);