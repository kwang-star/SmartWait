<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "root";
$mydb = "smartwaitapp";
$output = "";


try {
	// Create connection
	$conn = new mysqli($servername, $username, $password, $mydb);
	//Connection Success
	echo "Connected successfully";
	
	$sql = "INSERT INTO patient_requests (firstname, lastname, email, dob, gender, id)
	VALUES ('Ester', 'Wang', 'kw@gmail.com', '2022-11-01', 'F', '6');";
	$result = $conn->query($sql);

	echo "New record created successfully";
}
//catch exception
catch(Exception $e) {
	$output = 'Failed: ' .$e->getMessage();
	
	if ($conn->connect_error) {
		//If Connection Failed
		die("Connection failed: " . $conn->connect_error);
	}
	if ($result === FALSE) {
	echo "Error: " . $sql . "<br>" . $conn->error;
	}
}

$conn->close();
echo "End";
?>