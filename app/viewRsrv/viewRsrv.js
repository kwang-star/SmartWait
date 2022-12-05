'use strict';

angular.module('myApp.viewRsrv', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewRsrv', {
    templateUrl: 'viewRsrv/viewRsrv.html',
    controller: 'viewRsrvCtrl'
  });
}])

.controller('viewRsrvCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.fields = {};
  //Future improvement: To allow staff to create options.
  $scope.doctors = ["Dr. A", "Dr. B", "Dr. C"];
  $scope.today = new Date();
  $scope.today.setHours(0,0,0,0);
  $scope.tomorrow = new Date();
  $scope.tomorrow = $scope.tomorrow.setDate($scope.today.getDate() + 1);
  $scope.maxApptDate = new Date();
  $scope.maxApptDate = $scope.maxApptDate.setDate($scope.today.getDate() + 7);

  $scope.apptIntervals = [];

  $scope.submit = function() 
  {
    //Fill in the time for apptDay
    let time = $scope.fields.apptTime.split(':');
    $scope.fields.apptDay.setHours(time[0],time[1],0,0);
    
    var content = [];
    let url = "http://localhost:8081/demo/appts.php";
    $http.post(url, $scope.fields)
    .then(function (response){
        content = response.data;
      
        if (content.status == 1)
        {
          alert(content.msg);
          $scope.fields = {};
        }
        else
        {
          alert("Submission Failed. Try again."
          + "\n If reoccuring, please contact administrator.");
        }
      }
    );
  };

  $scope.getAvailApptTime = function()
  {
    //Check PreReq that Appt Day is filled
    if ($scope.reserve.apptDay.$invalid)
    {
      console.log("Appt Day is not Filled");
      return;
    }

    let initArr = createApptIntervals();
    removeOccupiedApptTimes(initArr);
  }

  //Removed occupied appointment times from input and set $scope.apptIntervals
  function removeOccupiedApptTimes(inApptTimes)
  {
    var content = [];
    let url = "http://localhost:8081/demo/appts.php";
    $http.get(url).then(function (response){
      content = response.data;
      content.forEach( function(item){
        //If not the same doctor, continue
        if ($scope.fields.doctor !== item.doctor)
        {
          // console.log($scope.fields.doctor + item.doctor + "not same doctor");
          return;
        }
        
        //Get Date and Time
        //Note: Time was stored in Database as UTC
        let existingAppt = new Date(item.time);
        let existingApptTime = [existingAppt.getHours() - 5, existingAppt.getMinutes()];
        
        //If not the same day, continue
        existingAppt.setHours(0,0,0,0);
        if ($scope.fields.apptDay.getTime() !== existingAppt.getTime())
        {
          // console.log("not same day");
          return;
        }

        //Remove Appt Time
        let match = formatHHMM(existingApptTime[0], existingApptTime[1]);
        inApptTimes.splice(inApptTimes.indexOf(match), 1);
      });

      $scope.apptIntervals = inApptTimes;
    });
  };
  
  //Create appt intervals based on selected appt day and time at selecting appt day
  // Future Improvement: Timeout Form or Refresh time options within the interval time: 30 minutes
  function createApptIntervals()
  {
    let minHr = 8;
    let minMin = 0;
    let maxHr = 16;

    //For now, removed functionality to make appointment for the same day
    //  -Mainly due to identified conflict if walk-in takes an open appointment 
    //    and skips other earlier walk-ins
    //Retained in case of future need
    // if ($scope.fields.apptDay.getTime() === $scope.today.getTime())
    // {
    //   //Next Earliest Appointment Time is 30min in future.
    //   let currentTime = new Date();
    //   currentTime.setMinutes(currentTime.getMinutes() + 30);

    //   //If earliest next appt time is past latest appt time, return.
    //   if ((currentTime.getHours() > maxHr) ||
    //   ((currentTime.getHours() == maxHr) && (currentTime.getMinutes() > 0)))
    //   {
    //     return [];
    //   }

    //   //Check what is next ealiest Appt Time
    //   let hourCheck = currentTime.getHours();
    //   let minCheck = currentTime.getMinutes();
    //   if(hourCheck >= minHr)
    //   {
    //     minHr = hourCheck;
    //     if (minCheck == 0)
    //     {
    //       minMin = 0;
    //     }
    //     else if (minCheck <= 30)
    //     {
    //       minMin = 30;
    //     }
    //     else 
    //     {
    //       minHr++;
    //       minMin = 0;
    //     }
    //   }
    // }
    
    return createIntervals(formatHHMM(minHr, minMin), formatHHMM(maxHr, 0))
                            .map(formatDateHHMM);
  };
  
}]);
  
//stepMM is minutes from interval
function createIntervals(startTime, endTime, stepMM = 30) {
  //"01/01/2001" is just an arbitrary date
  let until = Date.parse("01/01/2001 " + endTime);
  let from = Date.parse("01/01/2001 " + startTime);
  
  let intervalsPerHour = 60 / stepMM;
  let milisecsPerHour = 60 * 60 * 1000;
  let max = (Math.abs(until-from) / (milisecsPerHour))*intervalsPerHour;
  let time = new Date(from);
  let intervals = []; 

  for (let i = 0; i <= max; i++) {
    //To push date into array by value
    intervals.push(new Date(time));
    time.setMinutes(time.getMinutes() + stepMM);
  }

  return intervals;
};

//format type Date to "HH:MM"
function formatDateHHMM(date) {  
  let hour = date.getHours();
  let minute = date.getMinutes();
  return padTo2Digits(hour) + ":" + padTo2Digits(minute);
};

//format integer hr and min to "HH:MM"
function formatHHMM(hour, minute) {  
  return padTo2Digits(hour) + ":" + padTo2Digits(minute);
};

//pad zeros in front if needed to output two digits
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
};