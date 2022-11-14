'use strict';

describe('myApp.view3 module', function() {
  var mainScope, view3Ctrl, httpBackend, http;

  beforeEach(module('myApp.view3'));
  beforeEach(inject(function($rootScope, $controller, $httpBackend, $http) {
    mainScope = $rootScope.$new();
    httpBackend = $httpBackend;
    http = $http;
    view3Ctrl = $controller('View3Ctrl', {$scope: mainScope});
  }));
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('view3 controller', function(){
    
    //Check Initialization
    it('should be initialized with', function() {
      expect(view3Ctrl).toBeDefined();
      expect(mainScope.genders.length).toBe(2);
      expect(mainScope.currentDate).toBeDefined();
      expect(mainScope.fields).toEqual({});
    });

    //Check behaviour when POST to server is successful
    it('form submitted successfully', function() {
      mainScope.fields = {
        "fname"			    : 'K',
        "lname"			    : 'M',
        "email"			    : 'km@gmail.com',
        "dob"			      : new Date("2000-11-20"),
        "gender" 	      : 'M'
      };

      var response = {
        "status": 1,
        "msg"   : "success"
      }
      
      spyOn(window, "alert");
      httpBackend.whenPOST('http://localhost:8081/demo/req_patient.php', mainScope.fields)
                .respond(response);
    
      mainScope.submit();
      httpBackend.flush();
      expect(mainScope.fields).toEqual({});
      expect(window.alert).toHaveBeenCalledWith(response.msg);
    });

    //Check behaviour when POST to server fails
    it('form submit error', function() {
      mainScope.fields = {
        "fname"			    : 'K',
        "lname"			    : 'M',
        "email"			    : 'km@gmail.com',
        "dob"			      : new Date("2000-11-20"),
      };

      var response = {
        "status": 0,
        "msg"   : "failed"
      }
      
      spyOn(window, "alert");
      httpBackend.whenPOST('http://localhost:8081/demo/req_patient.php', mainScope.fields)
                .respond(response);
    
      mainScope.submit();
      httpBackend.flush();
      expect(mainScope.fields).not.toEqual({});
      expect(window.alert).toHaveBeenCalledWith("Submission Failed. Please contact administrator.");
    });
  });
});