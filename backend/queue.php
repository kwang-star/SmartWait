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
        6. clean up expired appts
            {
                cmd: refresh_appts
            }
*/
if($_SERVER['REQUEST_METHOD'] == "POST"){
    // Future Improvement: 1. Catch throws and better report errors for debugging
    // 2. Security: Re-evaluate what info to withhold
    // 3. Security: Check/Fix Cybersecurity vulnerabilities. 
    // 4. Generalization: make global variables for tables used >1 to make future changes easier
    $response = "";
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    //Get cmd
    $cmd = $data->cmd;
	switch ($cmd)
    {
        //Handle appointment checkin
        case "add_appt":
            // Get data from the REST client
	        $apptId    = "$data->apptID"; 

            //Check appt id
            $sql= "SELECT * FROM $waitQA_table WHERE apptId = '$apptId';";
            $match = get_db_info($sql);

            if(count($match) == 0)
            {
                //Apointment either not stored, expired, or not for today
                $response = array("status" => 0, "msg" => "Invalid Appt Id!\nAppointment may have expired or is not yet available for checkin.");
                end_request($response);
                return;
            }

            //Get Appt Info
            $sql= "SELECT * FROM appt WHERE id = '$apptId';";
            $appt_info = get_db_info($sql);

            if(count($appt_info) == 0)
            {
                $response = array("status" => 0, "msg" => "Unexpected error: Appointment Not Found!");
                end_request($response);
                return;
            }
            $appt_info = $appt_info[0];

            //Get Patient Info
            $sql = "SELECT * FROM patients WHERE id={$appt_info['patient']};";
            $pat_info = get_db_info($sql);

            if(count($pat_info) == 0)
            {
                $response = array("status" => 0, "msg" => "Unexpected error: Patient Information Not Found");
                end_request($response);
                return;
            } 
            
            $pat_info = $pat_info[0];
            $patName = $pat_info["firstname"] . " " . $pat_info["lastname"];

            //Add Appt to Queues
            $sql = "INSERT INTO $waitQG_table (patId, patName, apptFlag, apptId, doctor, note)"
                    . " VALUES ({$appt_info['patient']}, '$patName', '1', {$appt_info['id']}, '{$appt_info['doctor']}', '{$appt_info['note']}');";
            $result = general_db_query($sql);

            if ($result === FALSE) {
                $response = array("status" => 0, "msg" => "Error adding appointment to queue!");
                //echo "Error: " . $sql . "<br>" . $conn->error;
                end_request($response);
                return;
            }

            //Update Appt Queue
            $sql = "UPDATE $waitQA_table SET checkInFlag = '1' WHERE $waitQA_table.apptId = {$appt_info['id']};";
            $result = general_db_query($sql);

            if ($result === FALSE) {
                //shouldn't be too big of a problem even if this fails
            }

            //Future Improvement: Display Appt Info to User
            // $response = array(
            //     "status" => 0, 
            //     "msg" => $appt_info
            // );
            break;
        //Handle walk-in checkin
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
                $response = array("status" => 0, "msg" => "Invalid Patient Id!");
                end_request($response);
                return;
            }
            $patName = $result->fetch_assoc();
            $patName = $patName["firstname"] . " " . $patName["lastname"];

            //Add to wait queue
            $sql = "INSERT INTO $waitQG_table (patId, patName, apptFlag, doctor, note)"
                    . " VALUES ('$uid', '$patName', '0', '$doctor', '$reason');";
            $result = general_db_query($sql);
            if ($result === FALSE) {
                $response = array("status" => 0, "msg" => "Error adding walkin to queue!");
                //echo "Error: " . $sql . "<br>" . $conn->error;

            }

            break;
        case "next":
            // Get data from the REST client
	        $doc    = "$data->doctor";

            //Future Improvement: Store/Calc Avg Wait Time of Each Doctor
            $sql= "SELECT value FROM vars WHERE var='default_waittime'";
            $waitTime = general_db_query($sql)->fetch_assoc();

            $now = date("H:i");
            $appt_priorty_time = date('H:i:s', strtotime($now . " +{$waitTime['value']} minutes"));

            //Find Earliest Appt That Need to be Prioiritized 
            $sql = "SELECT * FROM $waitQA_table WHERE time <= '$appt_priorty_time' AND checkInFlag = 1"
                    . " AND doctor = '$doc'"
                    . " ORDER BY $waitQA_table.time ASC LIMIT 1;";
            $appts = get_db_info($sql);

            //Found Appts, advance earliest appointment
            if(count($appts) > 0)
            {
                $id = $appts[0]['apptId'];
                //Remove appointment fom queues and appt table
                //Future Improvement: Evaluate if check of db result from delete is needed
                $sql= "DELETE FROM $waitQA_table WHERE $waitQA_table.apptId = $id";
                general_db_query($sql);
                $sql= "DELETE FROM $waitQG_table WHERE $waitQG_table.apptId = $id";
                general_db_query($sql);
                //Future Improvement: Mark status rather than delete for data gathering
                $sql= "DELETE FROM appt WHERE appt.id = $id";
                general_db_query($sql);

                //Return PatId
                //Future Improvement: Send more appt and patient info back to user
                $response = array(
                    "status" => 1, 
                    "msg" => "$doc Queue Advanced.",
                    "patId" => $appts[0]['patId']
                );
            }
            // Else, if None found, advance the general wait queue based on time of checkin
            else
            {
                //Get first person in wait queue
                $sql = "SELECT * FROM $waitQG_table WHERE doctor = '$doc' LIMIT 1;";
                $next_pat = get_db_info($sql); 
                if(count($next_pat) == 0) 
                {
                    $response = array(
                        "status" => 0, 
                        "msg" => "No patients in $doc queue."
                    );
                }
                else
                {
                    $id = $next_pat[0]['patId'];
                    //Remove appointment fom queues and appt table
                    //Future Improvement: Evaluate if check of db result from delete is needed
                    $sql= "DELETE FROM $waitQG_table WHERE $waitQG_table.patId = $id";
                    general_db_query($sql);

                    $apptid = $next_pat[0]['apptId'];
                    if (!is_null($apptid))
                    {
                        $sql= "DELETE FROM $waitQA_table WHERE $waitQA_table.apptId = $apptid";
                        general_db_query($sql);
                        //Future Improvement: Mark status rather than delete for data gathering
                        $sql= "DELETE FROM appt WHERE appt.id = $apptid";
                        general_db_query($sql);
                    }
                    
                    //Return PatId
                    //Future Improvement: Send more appt and patient info back to user
                    $response = array(
                        "status" => 1, 
                        "msg" => "$doc Queue Advanced.",
                        "patId" => $id
                    );
                }
                
            }
            
            //Choose either from walk in queue or appointment queue
            break;
        //Start Wait Queue
        case "start": 
            $results = end_queue();
            if (in_array(FALSE, $results)) 
            {
                $response = array("status" => 0, "msg" => "Error cleaning up queue!");
                //echo "Error: " . $sql . "<br>" . $conn->error;
                end_request($response);
                return;
            }
            // Future Improvement: When doctor-list is inputted by user and 
            // not hardcoded, also update initialization of queues
            $drs = array("Dr. A", "Dr. B", "Dr. C");

            $results = init_wait_queue($drs);
            set_queue_status();
            if (in_array(FALSE, $results)) {
                //Still count as success
                $response = array("status" => 1, "msg" => "Warning: May not have gotten all appointments!");
                //echo "Error: " . $sql . "<br>" . $conn->error;
            }
            break;
        //End Wait Queue
        case "end":
            $results = end_queue();
            clr_queue_status();
            if (in_array(FALSE, $results)) 
            {
                $response = array("status" => 1, "msg" => "Warning: May not have cleaned up all queues!");
                //echo "Error: " . $sql . "<br>" . $conn->error;
            }
            //Future improvements: Further data analysis
            break;
        case "refresh_appts":
            //Remove appointments expired and not checked in
            $now = date("H:i");
            $exp_chk = date('H:i:s', strtotime($now . ' -15 minutes'));

            $sql = "DELETE FROM $waitQA_table WHERE `checkInFlag`=0 AND time < '$exp_chk';";

            $result = general_db_query($sql);
            if ($result === FALSE) {
                $response = array("status" => 0, "msg" => "Error");
                //echo "Error: " . $sql . "<br>" . $conn->error;
            }
            break;
        default:
            $response = array("status" => 0, "msg" => "Command not identified!");
    }
    
    if ($response == "") 
    {
        $response = array("status" => 1, "msg" => "$cmd completed");
    }
}
// GET: Client ask for wait queue
elseif ($_SERVER['REQUEST_METHOD'] == "GET"){
    $opt = $_GET['option'];
    switch ($opt)
    {
        case "status":
            //Get
            $sql= "SELECT value FROM vars WHERE var='queue_status'";
            $result = general_db_query($sql);
            $response = $result->fetch_assoc();
            break;
        default:
            //Get Queue
            $sql= "SELECT * FROM $waitQG_table;";
            $response = get_db_info($sql);
            break;
    }
}
else{
	$response = array("status" => 0, "msg" => "Request method not accepted!");
}

end_request($response);
return;

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
    return $_SESSION['conn']->query($sql);
}

//Set Queue Status
function set_queue_status()
{
    $sql = "UPDATE vars SET value = '1' WHERE vars.var = 'queue_status';";
    return $_SESSION['conn']->query($sql);
}

//Clr Queue Status
function clr_queue_status()
{
    $sql = "UPDATE vars SET value = '0' WHERE vars.var = 'queue_status';";
    return $_SESSION['conn']->query($sql);
}

//End Queue
function end_queue()
{
    global $waitQ_table_names;
    $results = array();
    foreach ($waitQ_table_names as $table)
    {
        array_push($results,general_db_query("DELETE FROM $table"));
    }
    return $results;
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
    $results = array();

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
            // if ($time_expired >= $now)
            // {
                $sql = "INSERT INTO $waitQA_table (doctor, time, apptId, checkInFlag) "
                        . "VALUES ('$doc', '$time', {$appt['id']},  0);";
                array_push($results, general_db_query($sql));
                
            // }
        } 
    }

    return $results;
}

//Convert string date GMT to "hh:mm" EST 
function get_time($date_time)
{
    $date=strtotime($date_time . "GMT");
    return date("H:i", $date);
}

function cleanup($docList)
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
?>