'use strict';

// Declare app level module which depends on views, and core components
angular.module('staffApp', [
  'ngRoute',
  'staffApp.patReq',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/staff/patReq'});
}]);
