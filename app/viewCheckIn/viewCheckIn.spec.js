'use strict';

describe('myApp.viewCheckIn module', function() {
  var mainScope, viewCheckInCtrl, httpBackend, http;

  beforeEach(module('myApp.viewCheckIn'));
  beforeEach(inject(function($rootScope, $controller, $httpBackend, $http) {
    mainScope = $rootScope.$new();
    httpBackend = $httpBackend;
    http = $http;
    viewCheckInCtrl = $controller('viewCheckInCtrl', {$scope: mainScope});
  }));
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('viewCheckIn controller', function(){
    
    //Check Initialization
    it('should be initialized with', function() {
      expect(viewCheckInCtrl).toBeDefined();
    });

  });
});