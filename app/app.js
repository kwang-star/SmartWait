'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.viewWaitQueue',
  'myApp.viewRsrv',
  'myApp.viewUser',
  'myApp.viewCheckIn',
  'myApp.version'
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/viewWaitQueue'});
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
});
