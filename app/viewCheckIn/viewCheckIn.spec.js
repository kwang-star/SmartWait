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
    
    //Check Initialization W/ queue status = 1
    it('should be initialized with (QS = 1)', function() {
      var response = {
        "value": "1"
      };
      httpBackend.whenGET('http://localhost:8081/demo/queue.php?status=1')
        .respond(response);
      httpBackend.flush();

      expect(viewCheckInCtrl).toBeDefined();
      expect(mainScope.doctors.length).toBeGreaterThan(0);
      expect(mainScope.fields).toEqual({});
      expect(mainScope.initFlag).toBe(true);
      expect(mainScope.startFlag).toBe(true);
    });

    //Check Initialization W/ queue status = 0
    it('should be initialized with (QS = 0)', function() {
      var response = {
        "value": "0"
      };
      httpBackend.whenGET('http://localhost:8081/demo/queue.php?status=1')
        .respond(response);
      httpBackend.flush();

      expect(viewCheckInCtrl).toBeDefined();
      expect(mainScope.doctors.length).toBeGreaterThan(0);
      expect(mainScope.fields).toEqual({});
      expect(mainScope.initFlag).toBe(true);
      expect(mainScope.startFlag).toBe(false);
    });

    describe('inner describe', function () {
      beforeEach(function () {
        var response = {
          "value": "1"
        };
        httpBackend.whenGET('http://localhost:8081/demo/queue.php?status=1')
          .respond(response);

        mainScope.initFlag = false;
      });

      it('have successful Post Appt Scenario', function () {
        mainScope.fields = 
        {
          "cmd": "add_appt",
          "apptId": 30
        };

        var response = {
          "status": 1,
          "msg"   : "Success"
        }

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitAppt();
        httpBackend.flush();
        
        expect(mainScope.fields).toEqual({});
        expect(mainScope.initFlag).toBe(true);
        expect(window.alert).toHaveBeenCalledWith(response.msg);
      });

      it('have failed Post Appt Scenario', function () {
        mainScope.fields = 
        {
          "cmd": "add_appt",
          "apptId": 30
        };

        var response = {
          "status": 0,
          "msg"   : "Failed"
        };

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitAppt();
        httpBackend.flush();

        expect(window.alert).toHaveBeenCalledWith(response.msg);
        expect(mainScope.fields).not.toEqual({});
        expect(mainScope.initFlag).toBe(false);
      });

      it('have successful Post Walkin Scenario', function () {
        mainScope.fields = 
        {
          "cmd": "add_walkin",
          "uid": 30,
          "doctor": "Dr. Z",
        };

        var response = {
          "status": 1,
          "msg"   : "Success"
        }

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitAppt();
        httpBackend.flush();
        
        expect(mainScope.fields).toEqual({});
        expect(mainScope.initFlag).toBe(true);
        expect(window.alert).toHaveBeenCalledWith(response.msg);
      });

      it('have failed Post walkin Scenario', function () {
        mainScope.fields = 
        {
          "cmd": "add_walkin",
          "uid": 30,
          "doctor": "Dr. Z",
        };

        var response = {
          "status": 0,
          "msg"   : "Failed"
        };

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitAppt();
        httpBackend.flush();

        expect(window.alert).toHaveBeenCalledWith(response.msg);
        expect(mainScope.fields).not.toEqual({});
        expect(mainScope.initFlag).toBe(false);
      });
    });
  });
});