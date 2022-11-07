<?php
//header("Access-Control-Allow-Origin: *");
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
echo "Connected successfully";

//Insert new record
$sql = "INSERT INTO patient_requests (firstname, lastname, email, dob, gender, id)
VALUES ('Test', 'Wang', 'kw@gmail.com', '2022-11-01', 'F', '6');";
$result = $conn->query($sql);
if ($result === FALSE) {
	echo "Error: " . $sql . "<br>" . $conn->error;
}
else
{
	echo "New record created successfully";
}

$conn->close();
echo "End";
?>