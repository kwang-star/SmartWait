'use strict';

describe('myApp.viewWaitQueue module', function() {
  var mainScope, viewWaitQueueCtrl, httpBackend, http;

  beforeEach(module('myApp.viewWaitQueue'));
  beforeEach(inject(function($rootScope, $controller, $httpBackend, $http) {
    mainScope = $rootScope.$new();
    httpBackend = $httpBackend;
    http = $http;

    viewWaitQueueCtrl = $controller('viewWaitQueueCtrl', {$scope: mainScope});
  }));
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('viewWaitQueue controller', function(){
    
    //Check Initialization W/ queue status = 1
    it('should be initialized with (QS = 1)', function() {
      var response = {
        "value": "1"
      };
      httpBackend.whenGET('http://localhost:8081/demo/queue.php?status=1')
        .respond(response);

      var response1 = [
        {
            "patId": "3",
            "patName": "Em Stark",
            "apptFlag": "0",
            "apptId": null,
            "doctor": "Dr. A",
            "note": "2"
        },
        {
            "patId": "6",
            "patName": "K W",
            "apptFlag": "0",
            "apptId": null,
            "doctor": "Dr. A",
            "note": ""
        }
      ];

      mainScope.doctors.forEach( item => 
      httpBackend.whenGET("http://localhost:8081/demo/queue.php?doctor=" + item)
        .respond(response1));

      httpBackend.flush();

      expect(viewWaitQueueCtrl).toBeDefined();
      expect(mainScope.doctors.length).toBeGreaterThan(0);
      expect(mainScope.queueFlag).toBe(true);
      expect(Object.keys(mainScope.queues).length == mainScope.doctors.length).toBe(true);
      mainScope.doctors.forEach( item => 
        expect(mainScope.queues[item]).toEqual(response1));
    });

    //Check Initialization W/ queue status = 0
    it('should be initialized with (QS = 0)', function() {
      var response = {
        "value": "0"
      };

      httpBackend.whenGET('http://localhost:8081/demo/queue.php?status=1')
        .respond(response);

      var response1 = [
        {
            "patId": "3",
            "patName": "Em Stark",
            "apptFlag": "0",
            "apptId": null,
            "doctor": "Dr. A",
            "note": "2"
        }
      ];

      mainScope.doctors.forEach( item => 
      httpBackend.whenGET("http://localhost:8081/demo/queue.php?doctor=" + item)
        .respond(response1));

      httpBackend.flush();

      expect(viewWaitQueueCtrl).toBeDefined();
      expect(mainScope.doctors.length).toBeGreaterThan(0);
      expect(mainScope.queueFlag).toBe(false);
      expect(Object.keys(mainScope.queues).length == mainScope.doctors.length).toBe(true);
      mainScope.doctors.forEach( item => expect(mainScope.queues[item]).toEqual(response1));
    });

  });
});