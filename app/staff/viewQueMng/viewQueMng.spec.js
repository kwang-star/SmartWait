'use strict';

describe('staffApp.viewQueMng module', function() {
  var mainScope, viewQueMngCtrl, httpBackend, http;

  beforeEach(module('staffApp.viewQueMng'));
  beforeEach(inject(function($rootScope, $controller, $httpBackend, $http) {
    mainScope = $rootScope.$new();
    httpBackend = $httpBackend;
    http = $http;
    viewQueMngCtrl = $controller('viewQueMngCtrl', {$scope: mainScope});
  }));
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('viewQueMng controller', function(){
    
    //Check Initialization
    it('should be initialized with', function() {
      expect(viewQueMngCtrl).toBeDefined();
    });

  });
});