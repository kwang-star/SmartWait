'use strict';

describe('myApp.view3 module', function() {
  var mainScope;
  var view3Ctrl;

  beforeEach(module('myApp.view3'));
  beforeEach(inject(function($rootScope, $controller) {
    mainScope = $rootScope.$new();
    view3Ctrl = $controller('View3Ctrl', {$scope: mainScope});
  }));

  describe('view3 controller', function(){
    it('should be initialized with', function() {
      expect(view3Ctrl).toBeDefined();
      expect(mainScope.genders.length).toBe(2);
      expect(mainScope.currentDate).toBeDefined();
    });

    it('form fields clears', function() {
      mainScope.fields.fname 			    = 'K';
      mainScope.fields.lname 			    = 'M';
      mainScope.fields.email 			    = 'km@gmail.com';
      mainScope.fields.dob 				    = new Date("2000-11-20");
      mainScope.fields.selectedGender 	= 'M';
      mainScope.submit();
      expect(mainScope.fields).toEqual({});
    });
  });
});