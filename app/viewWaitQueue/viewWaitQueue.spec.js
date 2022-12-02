'use strict';

describe('myApp.viewWaitQueue module', function() {
  var mainScope;
  var viewWaitQueueCtrl;

  beforeEach(module('myApp.viewWaitQueue'));

  beforeEach(inject(function($rootScope, $controller) {
    mainScope = $rootScope.$new();
    viewWaitQueueCtrl = $controller('viewWaitQueueCtrl', {$scope: mainScope});
  }));

  describe('viewWaitQueue controller', function(){
    it('should be initialized with', function() {
      expect(viewWaitQueueCtrl).toBeDefined();
    });
  });
});