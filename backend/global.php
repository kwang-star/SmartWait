<?php
date_default_timezone_set("America/New_York");
if(!session_id()) 
{
    session_start();
}
// if(!isset($_SESSION['conn'])) {
//     $_SESSION['conn'] = start_db();
// }

function start_db()
{
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

    return $conn;
}

function close_db()
{
    $_SESSION['conn']->close();
    unset($_SESSION['conn']);
}

function end_request($json)
{
    close_db();
    echo json_encode($json);
}


function verify_patId($uid)
{
    $sql = "SELECT * FROM patients WHERE id=$uid";
    return $_SESSION['conn']->query($sql);
}

?>