<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST, GET');
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

require("global.php");
print_r($GLOBALS['waitqueues']);
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
            

            break;
        case "next":
            //Choose either from walk in queue or appointment queue
            break;
        //Start Wait Queue
        case "start": 
            // Future Improvement: When doctor-list is inputted by user and 
            // not hardcoded, also update initialization of queues
            $drs = array("Dr. A", "Dr. B", "Dr. C");
            $GLOBALS['waitqueues'] = init_wait_queue($drs);
            print_r($GLOBALS['waitqueues']);
            break;
        //End Wait Queue
        case "end":
            unset($GLOBALS['waitqueues']);
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

//Initialize Wait Queues
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
    $table = "appt";
    $out = array();

    //Create Queues for Each Doctor
    foreach ($docList as $doc)
    {
        $drQues = array
        (
            "gen" => array(),
            "appt"=> array()
        );

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
                $drQues["appt"]["$time"] = array(
                    "checkInFlag" => false,
                    "apptId" => $appt["id"]
                );
            }
        }
        ksort($drQues["appt"]); //Sort 
         
        $out["$doc"] = $drQues;
    }
    
    return $out;
}

//Convert string date GMT to "hh:mm" EST 
function get_time($date_time)
{
    $date=strtotime($date_time . "GMT");
    return date("H:i", $date);
}

function verify_patid($patId)
{
    //Check Patient Uid
    $sql = "SELECT * FROM patients WHERE id=$uid";
    $result = $_SESSION['conn']->query($sql);
    print_r($result);
    if($result->num_rows == 0)
    {
        $json = array("status" => 0, "msg" => "Invalid Patient Id!");
        echo json_encode($json);
        return;
    }
}
?>