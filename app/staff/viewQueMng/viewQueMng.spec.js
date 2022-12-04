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
    
    //Check Initialization W/ queue status = 1
    it('should be initialized with (QS = 1)', function() {
      var response = {
        "value": "1"
      };
      httpBackend.whenGET('http://localhost:8081/demo/queue.php?status=1')
        .respond(response);
      httpBackend.flush();

      expect(viewQueMngCtrl).toBeDefined();
      expect(mainScope.doctors.length).toBeGreaterThan(0);
      expect(Object.keys(mainScope.doc_stat).length == mainScope.doctors.length).toBe(true);
      expect(mainScope.queueFlag).toBe(true);
    });

    //Check Initialization W/ queue status = 0
    it('should be initialized with (QS = 0)', function() {
      var response = {
        "value": "0"
      };
      httpBackend.whenGET('http://localhost:8081/demo/queue.php?status=1')
        .respond(response);
      httpBackend.flush();

      expect(viewQueMngCtrl).toBeDefined();
      expect(mainScope.doctors.length).toBeGreaterThan(0);
      expect(Object.keys(mainScope.doc_stat).length == mainScope.doctors.length).toBe(true);
      expect(mainScope.queueFlag).toBe(false);
    });

    describe('inner describe (QS = 0)', function () {
      beforeEach(function () {
        var response = {
          "value": "0"
        };
        httpBackend.whenGET('http://localhost:8081/demo/queue.php?status=1')
          .respond(response);
      });

      it('have successful Post Start Scenario', function () {
        var response = {
          "status": 1,
          "msg"   : "Success"
        }

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitStart();
        httpBackend.flush();
        
        expect(mainScope.queueFlag).toBe(true);
        expect(window.alert).toHaveBeenCalledWith(response.msg);
      });

      it('have failed Post Start Scenario', function () {
        var response = {
          "status": 0,
          "msg"   : "Failed"
        };

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitStart();
        httpBackend.flush();

        expect(window.alert).toHaveBeenCalledWith(response.msg);
        expect(mainScope.queueFlag).toBe(false);
      });

    });

    describe('inner describe (QS = 1)', function () {
      beforeEach(function () {
        var response = {
          "value": "1"
        };
        httpBackend.whenGET('http://localhost:8081/demo/queue.php?status=1')
          .respond(response);
      });

      it('have successful Post End Scenario', function () {
        var response = {
          "status": 1,
          "msg"   : "Success"
        }

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitEnd();
        httpBackend.flush();
        
        expect(mainScope.queueFlag).toBe(false);
        expect(window.alert).toHaveBeenCalledWith(response.msg);
        //Future: Add Doctor/Patient Check
      });

      it('have failed Post End Scenario', function () {
        var response = {
          "status": 0,
          "msg"   : "Failed"
        };

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitEnd();
        httpBackend.flush();

        expect(window.alert).toHaveBeenCalledWith(response.msg);
        expect(mainScope.queueFlag).toBe(true);
      });

      it('have successful Post Next Scenario', function () {
        var doc = "Dr. A";
        var response = {
          "status": 1,
          "patId" : "3",
          "msg"   : "Success"
        }

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitNext(doc);
        httpBackend.flush();
        
        expect(mainScope.queueFlag).toBe(true);
        expect(window.alert).toHaveBeenCalledWith(response.msg);
        expect(mainScope.doc_stat[doc]["patient"]).toBe(response.patId);
      });

      it('have failed Post Next Scenario', function () {
        var doc = "Dr. A";
        var response = {
          "status": 0,
          "patId" : "3",
          "msg"   : "Failed"
        };

        mainScope.doc_stat[doc]["patient"] = 4;

        spyOn(window, "alert");
        httpBackend.whenPOST('http://localhost:8081/demo/queue.php')
          .respond(response);

        mainScope.submitNext(doc);
        httpBackend.flush();

        expect(window.alert).toHaveBeenCalledWith(response.msg);
        expect(mainScope.queueFlag).toBe(true);
        expect(mainScope.doc_stat[doc]["patient"]).toBe("");
      });

    });

  });
});