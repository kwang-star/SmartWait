<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST, GET');
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "root";
$mydb = "smartwaitapp";
$table = "appt";

// Create connection
$conn = new mysqli($servername, $username, $password, $mydb);

//If Connection Failed
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}
//Connection Success
//echo "Connected successfully";

if($_SERVER['REQUEST_METHOD'] == "POST"){
	
    $json = file_get_contents('php://input');
    $data = json_decode($json);
	// Get data from the REST client
	$uid        = "$data->uid";
    $doctor     = "$data->doctor";
    $datetime   = "$data->apptDay";
    $reason     = NULL;
    if (property_exists($data, 'apptReason'))
    {
        $reason     = "$data->apptReason";
    }
    
    //Check Patient Uid
    $sql = "SELECT * FROM patients WHERE id=$uid";
    $result = $conn->query($sql);
    //print_r($result);
    if($result->num_rows == 0)
    {
        $json = array("status" => 0, "msg" => "Invalid Patient Id!");
        echo json_encode($json);
        return;
    }

    //Insert new record
    $sql = "INSERT INTO $table (patient, time, doctor, note)
    VALUES ('$uid', '$datetime', '$doctor',  '$reason');";

    $result = $conn->query($sql);
    if ($result === FALSE) {
        $json = array("status" => 0, "msg" => "Error submitting appointment! Please try again!");
        //echo "Error: " . $sql . "<br>" . $conn->error;
    }
    else
    {
        $json = array("status" => 1, "msg" => "Appointment has been submitted successfully!");
        //echo "New record created successfully";
    }

}
elseif ($_SERVER['REQUEST_METHOD'] == "GET"){
    $sql = "SELECT * FROM $table";
    $result = $conn->query($sql);
    $r = array();
    if( $result->num_rows>0){
        while($row = $result->fetch_assoc()){
            $r[] = $row;
        }
    }
    $json = $r;
}
else{
	$json = array("status" => 0, "msg" => "Request method not accepted!");
}

$conn->close();
echo json_encode($json);
?>