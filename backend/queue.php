<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST, GET');
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

require("global.php");
$_SESSION['conn'] = start_db();
$waitQA_table = "wait_queue_appt";
$waitQG_table = "wait_queue_gen";
$waitQ_table_names = array( $waitQG_table, $waitQA_table);

/* POST: Client ask to modify queue
        1. add appointment to queue
            {   
                cmd: add_appt
                appt_id: xx 
            }
        2. add walkin to queue
            {   
                cmd: add_walkin
                info: {} 
            }
        3. advance queue
            {   
                cmd: next 
            }
        4. start queue
            {
                cmd: start
            }
        5. end queue
            {
                cmd: end
            }
*/
if($_SERVER['REQUEST_METHOD'] == "POST"){
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    //Get cmd
    $cmd = $data->cmd;
	switch ($cmd)
    {
        case "add_appt":
            //Check appt id
            get_db_info();
            //If none, return appt not match
            //If exist, Add Appt to appointment queue
            break;
        //Add to docotor walking queue
        case "add_walkin":
            // Get data from the REST client
	        $uid    = "$data->uid"; 
            $doctor = "$data->doctor";
            $reason     = NULL;
            if (property_exists($data, 'apptReason'))
            {
                $reason     = "$data->apptReason";
            }
    
            //Verify Pat ID
            $result = verify_patId($uid);
            if($result->num_rows == 0)
            {
                $json = array("status" => 0, "msg" => "Invalid Patient Id!");
                end_request($json);
                return;
            }
            $patName = $result->fetch_assoc();
            $patName = $patName["firstname"] . " " . $patName["lastname"];
            echo $patName;

            //Add to wait queue
            $sql = "INSERT INTO $waitQG_table (patId, patName, apptFlag, doctor, note)"
                    . " VALUES ('$uid', '$patName', '0', '$doctor', '$reason');";
            $result = general_db_query($sql);
            if ($result === FALSE) {
                $json = array("status" => 0, "msg" => "Error adding walkin to queue!");
                //echo "Error: " . $sql . "<br>" . $conn->error;
                end_request($json);
                return;
            }

            break;
        case "next":
            //Choose either from walk in queue or appointment queue
            break;
        //Start Wait Queue
        case "start": 
            // Future Improvement: When doctor-list is inputted by user and 
            // not hardcoded, also update initialization of queues
            $drs = array("Dr. A", "Dr. B", "Dr. C");
            $result = init_wait_queue($drs);
            if ($result === FALSE) {
                $json = array("status" => 0, "msg" => "Error starting queue!");
                //echo "Error: " . $sql . "<br>" . $conn->error;
                end_request($json);
                return;
            }
            break;
        //End Wait Queue
        case "end":
            foreach ($waitQ_table_names as $table)
            {
                $result = general_db_query("DELETE FROM $table");
                if ($result === FALSE) {
                    $json = array("status" => 0, "msg" => "Error ending!");
                    //echo "Error: " . $sql . "<br>" . $conn->error;
                    end_request($json);
                    return;
                }
            }
            //Future improvements: Further data analysis
            break;
        default:
            $json = array("status" => 0, "msg" => "Command not identified!");
            end_request($json);
            return;
    }
    
    $json = array("status" => 1, "msg" => "$cmd completed");
}
// GET: Client ask for wait queue
elseif ($_SERVER['REQUEST_METHOD'] == "GET"){
}
else{
	$json = array("status" => 0, "msg" => "Request method not accepted!");
}

end_request($json);

//Functions

//Get info from sql table with specified $sql
function get_db_info($sql)
{
    $result = $_SESSION['conn']->query($sql);
    $r = array();
    if( $result->num_rows>0){
        while($row = $result->fetch_assoc()){
            $r[] = $row;
        }
    }
    return $r;
}

//Perform specified $sql query on sql table
function general_db_query($sql)
{
    $result = $_SESSION['conn']->query($sql);
    return $result;
}

//Initialize Wait Queues (Appts)
//Wait Queues Format:
// {
//     "Dr. A": 
//     { 
//         "gen": 
//         {
//             "patId": uid,
//             "patName": name,
//             "appt_flag": bool,
//             //if appt_flag = true
//             "apptId": id
//         },
//         "appt": 
//         {
//             "08:00":
//             {
//                 "apptId": id
//                 "checkInFlag": bool,
//             },
//             "16:00":
//             {
//                 ...
//             }
//             ...
//         }
//     },
//     "Dr. B": 
//     { 
//         ...
//     },
//     ...
// }
function init_wait_queue($docList)
{
    global $waitQA_table;
    $table = "appt";

    //Create Queues for Each Doctor
    foreach ($docList as $doc)
    {
        //Get Today's Appts For This Doctor
        //Currently, timezone diff is not not issue, since EST office close before 7pm EST.
        $today = date("Y-m-d"); 
        $sql = "SELECT * FROM $table WHERE doctor='$doc' AND time LIKE '$today%'";
        $appt_info = get_db_info($sql);
        //print_r($appt_info);

        // Fill In Appt Queue With Existing Appointments
        foreach($appt_info as $appt)
        {
            $time = get_time($appt["time"]);
            $time_expired = date('H:i', strtotime($time . ' +15 minutes'));
            $now = date("H:i");

            //Ignore if appt time expired
            if ($time_expired >= $now)
            {
                $sql = "INSERT INTO $waitQA_table (doctor, time, apptId, checkInFlag) "
                        . "VALUES ('$doc', '$time', {$appt['id']},  0);";
                $result = general_db_query($sql);
                return $result;
            }
        }
         
    }
}

//Convert string date GMT to "hh:mm" EST 
function get_time($date_time)
{
    $date=strtotime($date_time . "GMT");
    return date("H:i", $date);
}

?>