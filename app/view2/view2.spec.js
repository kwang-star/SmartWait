'use strict';

describe('myApp.view2 module', function () {
  var mainScope;
  var view2Ctrl, httpBackend, http;

  beforeEach(module('myApp.view2'));

  beforeEach(inject(function ($rootScope, $controller, $httpBackend, $http) {
    mainScope = $rootScope.$new();
    httpBackend = $httpBackend;
    http = $http;
    view2Ctrl = $controller('View2Ctrl', { $scope: mainScope });
  }));
  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('view2 controller', function () {
    it('should be initialized with', function () {
      expect(view2Ctrl).toBeDefined();
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

    // Below test are all for getAvailApptTime, which checks the form is valid or not
    // which is not mocked in unit testing
    // it('should not get intervals', function () {
    //   // mainScope.reserve.apptDay.$invalid = true;
    //   mainScope.fields = 
    //   {
    //     "apptDay": new Date("2022-11-22")
    //   };

    //   httpBackend.whenGET('http://localhost:8081/demo/appts.php')
    //     .respond([]);

    //   mainScope.getAvailApptTime();
    //   httpBackend.flush();
      
    //   expect(mainScope.apptIntervals.length).toBe(0);
    // });

    // it('able to get Available Appointment Times', function () {
    //   mainScope.fields = 
    //   {
    //     "apptDay": new Date("2022-11-22")
    //   };

    //   httpBackend.whenGET('http://localhost:8081/demo/appts.php')
    //     .respond([]);

    //   mainScope.getAvailApptTime();
    //   httpBackend.flush();
      
    //   expect(mainScope.apptIntervals.length).toBe(17);
    // });

    // it('removes occupied appointment time', function () {
    //   var get_response =
    //   [
    //     {
    //       "id": "26",
    //       "patient": "6",
    //       "time": "2022-11-24 14:30:00",
    //       "doctor": "Dr. C",
    //       "note": ""
    //     },
    //     { 
    //       "id": "27", 
    //       "patient": "0", 
    //       "time": "2022-11-24 16:00:00", 
    //       "doctor": "Dr. C", 
    //       "note": null 
    //     }
    //   ];
      
    //   httpBackend.whenGET('http://localhost:8081/demo/appts.php')
    //     .respond(get_response);

    //   mainScope.getAvailApptTime();
    //   httpBackend.flush();
    //   expect(mainScope.apptIntervals.length).toBe(17);
    // });
  });
});