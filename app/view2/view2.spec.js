'use strict';

describe('myApp.view2 module', function() {
  var mainScope;
  var view2Ctrl;

  beforeEach(module('myApp.view2'));

  beforeEach(inject(function($rootScope, $controller) {
    mainScope = $rootScope.$new();
    view2Ctrl = $controller('View2Ctrl', {$scope: mainScope});
  }));

  describe('view2 controller', function(){
    it('should be initialized with', function() {
      expect(view2Ctrl).toBeDefined();
    });
  });
});