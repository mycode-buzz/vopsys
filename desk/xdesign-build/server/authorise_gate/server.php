<?php

//This is the serverside counterpart of the clientside loggedin checker "authorise_gate"
$obj_post = json_decode(file_get_contents("php://input"));  
if(isset($_COOKIE["AuthorizeSessionKey"])) {         
    $obj_post->AuthorizeUserStatus=true;                             
    //renew login cookie 28 days, for all subdomains
    //n.b set cookine should remain commented out for the moment
    //setcookie("AuthorizeSessionKey", $_COOKIE["AuthorizeSessionKey"], time() + (86400 * 28), "/", explode(".", $_SERVER['HTTP_HOST'], 2)[1]);    
    //need to put in array again for options , particularly for samesite
}         

//comment in line below to allow non-cookie access, ie do not set status to true
// ie if runnning, below line will cause naviagtion away from login page.

/*
$obj_post->AuthorizeUserStatus=true;
//*/

echo json_encode($obj_post);  
?>