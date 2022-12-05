<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST, GET');
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "root";
$mydb = "smartwaitapp";

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
	$id  = "$data->id";

    //Insert new record
    $sql = "DELETE FROM patient_requests WHERE patient_requests.id = $id";

    $result = $conn->query($sql);
    if ($result === FALSE) {
        $json = array("status" => 0, "msg" => "Error removing request $id! Please try again!");
        //echo "Error: " . $sql . "<br>" . $conn->error;
    }
    else
    {
        $json = array("status" => 1, "msg" => "Request $id has been removed successfully!");
        //echo "New record created successfully";
    }

}
else{
	$json = array("status" => 0, "msg" => "Request method not accepted!");
}

$conn->close();
echo json_encode($json);
?>