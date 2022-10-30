'use strict';

describe('myApp.view1 module', function() {
  var mainScope;
  var view1Ctrl;

  beforeEach(module('myApp.view1'));

  beforeEach(inject(function($rootScope, $controller) {
    mainScope = $rootScope.$new();
    view1Ctrl = $controller('View1Ctrl', {$scope: mainScope});
  }));

  describe('view1 controller', function(){
    it('should be initialized with', function() {
      expect(view1Ctrl).toBeDefined();
    });
  });
});