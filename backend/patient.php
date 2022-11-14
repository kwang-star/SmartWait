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
	$fname  = "$data->firstname";
	$lname  = "$data->lastname";
    $email  = "$data->email";
    $dob    = "$data->dob";
    $gender = "$data->gender";

    //Insert new record
    $sql = "INSERT INTO patients (firstname, lastname, email, dob, gender)
    VALUES ('$fname', '$lname', '$email', '$dob', '$gender');";

    $result = $conn->query($sql);
    if ($result === FALSE) {
        $json = array("status" => 0, "msg" => "Error adding patient $fname! Please try again!");
        //echo "Error: " . $sql . "<br>" . $conn->error;
    }
    else
    {
        $json = array("status" => 1, "msg" => "Patient $fname has been added successfully!");
        //echo "New record created successfully";
    }

}
elseif ($_SERVER['REQUEST_METHOD'] == "GET"){
    $sql = "SELECT * FROM patients";
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