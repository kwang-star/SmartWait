'use strict';

describe('myApp.viewRsrv module', function () {
  var mainScope;
  var viewRsrvCtrl, httpBackend, http;

  beforeEach(module('myApp.viewRsrv'));

  beforeEach(inject(function ($rootScope, $controller, $httpBackend, $http) {
    mainScope = $rootScope.$new();
    httpBackend = $httpBackend;
    http = $http;
    viewRsrvCtrl = $controller('viewRsrvCtrl', { $scope: mainScope });
  }));
  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('viewRsrv controller', function () {
    it('should be initialized with', function () {
      expect(viewRsrvCtrl).toBeDefined();
      expect(mainScope.doctors.length).toBeGreaterThan(0);
      expect(mainScope.apptIntervals.length).toBe(0);
      expect(mainScope.today).toEqual(jasmine.any(Date));
      //Future improvements, check dates
    });

    it('outter functions', function () {
      expect(padTo2Digits(5)).toBe("05");
      expect(padTo2Digits(10)).toBe("10");

      let date = new Date("2021-10-20 14:05");
      expect(formatDateHHMM(date)).toBe("14:05");

      expect(formatHHMM(1, 50)).toBe("01:50");

      let result = createIntervals("11:00", "13:00", 30);
      expect(result.length).toBe(5);
    });

    it('Successful Post Scenario', function () {
      mainScope.fields = 
      {
        "apptDay": new Date("2022-11-22"),
        "apptTime": "12:00",
        "uid": 3,
        "doctor": "Dr. A",
        "apptReason": "Annual"
      };

      var response = {
        "status": 1,
        "msg"   : "Success"
      }

      spyOn(window, "alert");
      httpBackend.whenPOST('http://localhost:8081/demo/appts.php')
        .respond(response);

      mainScope.submit();
      httpBackend.flush();
      
      expect(mainScope.fields).toEqual({});
      expect(window.alert).toHaveBeenCalledWith(response.msg);
    });

    it('Failed Post Scenario', function () {
      mainScope.fields = 
      {
        "apptDay": new Date("2022-11-22"),
        "apptTime": "12:00",
        "uid": 3,
        "doctor": "Dr. A",
        "apptReason": "Annual"
      };

      var response = {
        "status": 0,
        "msg"   : "failed"
      }

      spyOn(window, "alert");
      httpBackend.whenPOST('http://localhost:8081/demo/appts.php')
        .respond(response);

      mainScope.submit();
      httpBackend.flush();
      
      expect(mainScope.fields).not.toEqual({});
      expect(window.alert).toHaveBeenCalledWith("Submission Failed. Try again."
      + "\n If reoccuring, please contact administrator.");
    });

    // Tests for getAvailApptTime, which checks the form is valid or not
    // is not mocked in unit testing. It will be e2e testing.
  });
});