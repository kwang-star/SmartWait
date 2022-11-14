'use strict';

describe('staffApp.patReq module', function() {
  var mainScope, patReqCtrl, httpBackend, http;

  beforeEach(module('staffApp.patReq'));

  beforeEach(inject(function($rootScope, $controller, $httpBackend,$http) {
    mainScope = $rootScope.$new();
    httpBackend = $httpBackend;
    http = $http;
    patReqCtrl = $controller('patReqCtrl', {$scope: mainScope});
  }));
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('patReq controller', function(){
    it('should be initialized with non list', function() {
      expect(patReqCtrl).toBeDefined();

      var response = [];
      httpBackend.whenGET('http://localhost:8081/demo/req_patient.php')
                .respond(response);
      httpBackend.flush();
      
      expect(mainScope.reqList.length).toBe(0);
    });

    it('success scenario of approving patient', function() {
      var get_response = 
      [
        {
          "firstname": "K",
          "lastname": "W",
          "email": "kw@gmail.com",
          "dob": "2022-11-09",
          "gender": "F",
          "id": "12"
        },
        {
            "firstname": "Km",
            "lastname": "W",
            "email": "kw@gmail.com",
            "dob": "2022-11-09",
            "gender": "F",
            "id": "13"
        }
      ];

      var success_post_res = {
        "status": 1,
        "msg"   : "success"
      };

      httpBackend.whenGET('http://localhost:8081/demo/req_patient.php')
                .respond(get_response);
      httpBackend.whenPOST("http://localhost:8081/demo/patient.php", )
                .respond(success_post_res);
      httpBackend.whenPOST('http://localhost:8081/demo/del_patient_req.php')
                .respond(success_post_res);
      httpBackend.flush();
      
      expect(mainScope.reqList).toEqual(get_response);
      mainScope.approve(get_response[0], 0);

      httpBackend.flush();
      expect(mainScope.reqList).toEqual([get_response[1]]);
    });

    it('success scenario of rejecting patient', function() {
      var get_response = 
      [
        {
          "firstname": "K",
          "lastname": "W",
          "email": "kw@gmail.com",
          "dob": "2022-11-09",
          "gender": "F",
          "id": "12"
        },
        {
            "firstname": "Km",
            "lastname": "W",
            "email": "kw@gmail.com",
            "dob": "2022-11-09",
            "gender": "F",
            "id": "13"
        }
      ];

      var success_post_res = {
        "status": 1,
        "msg"   : "success"
      };

      httpBackend.whenGET('http://localhost:8081/demo/req_patient.php')
                .respond(get_response);
      httpBackend.whenPOST('http://localhost:8081/demo/del_patient_req.php')
                .respond(success_post_res);
      httpBackend.flush();
      
      expect(mainScope.reqList).toEqual(get_response);
      mainScope.reject(get_response[1], 1);

      httpBackend.flush();
      expect(mainScope.reqList).toEqual([get_response[0]]);
    });

    it('failed scenario of approving patient', function() {
      var get_response = 
      [
        {
          "firstname": "K",
          "lastname": "W",
          "email": "kw@gmail.com",
          "dob": "2022-11-09",
          "gender": "F",
          "id": "12"
        }
      ];

      var success_post_res = {
        "status": 1,
        "msg"   : "success"
      };

      var fail_post_res = {
        "status": 0,
        "msg"   : "failed"
      };

      httpBackend.whenGET('http://localhost:8081/demo/req_patient.php')
                .respond(get_response);
      httpBackend.whenPOST("http://localhost:8081/demo/patient.php", )
                .respond(fail_post_res);
      httpBackend.whenPOST('http://localhost:8081/demo/del_patient_req.php')
                .respond(success_post_res);
      httpBackend.flush();
      
      expect(mainScope.reqList).toEqual(get_response);
      mainScope.approve(get_response[0], 0);

      httpBackend.flush();
      expect(mainScope.reqList).toEqual(get_response);
    });

    it('failed scenario of removing patient', function() {
      var get_response = 
      [
        {
          "firstname": "K",
          "lastname": "W",
          "email": "kw@gmail.com",
          "dob": "2022-11-09",
          "gender": "F",
          "id": "12"
        }
      ];

      var fail_post_res = {
        "status": 0,
        "msg"   : "failed"
      };

      httpBackend.whenGET('http://localhost:8081/demo/req_patient.php')
                .respond(get_response);
      httpBackend.whenPOST('http://localhost:8081/demo/del_patient_req.php')
                .respond(fail_post_res);
      httpBackend.flush();
      
      expect(mainScope.reqList).toEqual(get_response);
      mainScope.reject(get_response[0], 0);

      httpBackend.flush();
      expect(mainScope.reqList).toEqual(get_response);
    });
  });
});