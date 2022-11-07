<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST, GET');
header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Credentials: true');
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "root";
$mydb = "smartwaitapp";

// Create connection
$conn = new mysqli($servername, $username, $password, $mydb);

//If Connection Failed
if ($conn->connect_error) {
	//die("Connection failed: " . $conn->connect_error);
}
//Connection Success
//echo "Connected successfully";

if($_SERVER['REQUEST_METHOD'] == "POST"){
	
    $json = file_get_contents('php://input');
    $data = json_decode($json);
	// Get data from the REST client
	$fname = "$data->fname";
	// $id = "$data->id";

    //Insert new record
    $sql = "INSERT INTO patient_requests (firstname, lastname, email, dob, gender)
    VALUES ('$fname', 'Wang', 'kw@gmail.com', '2022-11-01', 'F');";

    $result = $conn->query($sql);
    if ($result === FALSE) {
        $json = array("status" => 0, "Error" => "Error adding To-Do! Please try again!");
        //echo "Error: " . $sql . "<br>" . $conn->error;
    }
    else
    {
        $json = array("status" => 1, "Success" => "User $fname has been added successfully!");
        //echo "New record created successfully";
    }

}
else{
	$json = array("status" => 0, "Info" => "Request method not accepted!");
}

$conn->close();
echo json_encode($json);
?>