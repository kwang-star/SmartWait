<?php
$servername = "localhost";
$username = "root";
$password = "root";

// Create connection
try {
	$conn = new mysqli($servername, $username, $password);
	//Connection Success
	echo "Connected successfully";
}
//catch exception
catch(Exception $e) {
	//Connection Failed
	//Return HTTPS error
	echo "Connection Failed";
	echo 'Message: ' .$e->getMessage();
}
?>