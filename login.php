<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "firebase_login";

$con = new mysqli($servername, $username, $password, $dbname);

if (!$con) {
  die("Connection failed: " . mysqli_connect_error());
}
//echo "Connected successfully";

$email = isset($_REQUEST['email']) ? $_REQUEST['email'] : '';
$provider = isset($_REQUEST['provider']) ? $_REQUEST['provider'] : '';
$username = isset($_REQUEST['username']) ? $_REQUEST['username'] : '';
$token = isset($_REQUEST['token']) ? $_REQUEST['token'] : '';

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCkZvwiLKcYHgm7xiJ3xNt0xx3xkssT7Ts&idToken=' . $token,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_HTTPHEADER => array("Content-length:0")
));

$response = curl_exec($curl);

curl_close($curl);
//echo $response;

$array_response=json_decode($response,true);
//print_r($array_response);

if (array_key_exists("users",$array_response)){

	$user_res=$array_response["users"];
	if(count($user_res)>0){
		$user_res_1=$user_res[0];

		if($user_res_1["email"]==$email){
			if($user_res_1["emailVerified"]=="1"){
		$check_user=mysqli_query($con,"select * from users where email='".$email."'");
		if(mysqli_num_rows($check_user)>0){
			echo "Login Successful";
			$_SESSION["email"]=$email;
		}

	$qr=mysqli_query($con,"INSERT INTO `users`(`username`, `email`, `token`, `created_at`, `login_type`) VALUES ('".$username."','".$email."','".$token."','".date('Y-m-d H:i:s')."','".$provider."')");

	if($qr){

	 // echo "User Created";
	  $_SESSION["email"]=$email;
	}
	else {
	  echo "Failed to create user";
	}
}
else {
	echo "Please Verify Your Email to Login";
}

}
else {
	echo"Unknown email User";
}
	}
	else {
	echo"Invalid User Request User Not Found";
}
}
	else {
		//echo"Unknown bad request";
}






