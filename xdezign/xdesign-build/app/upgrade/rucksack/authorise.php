<?php
//including this file prevents serviside scripts from running if the user is not logged in .

$LOGIN=false;//GLOBAL VARIABLE
$API_LOGIN=false;//GLOBAL VARIABLE
$API_AUTHENTICATED=false;//GLOBAL VARIABLE
/*$LOGIN=true;//*/
if(strpos(explode('.', $_SERVER['HTTP_HOST'])[0], "lock")===0){$LOGIN=true;}//check for login subdomain     
if(strpos(explode('.', $_SERVER['HTTP_HOST'])[0], "api")===0){$API_LOGIN=true;}//check for api subdomain     
if(!$LOGIN && !$API_LOGIN){if(!isset($_COOKIE["AuthorizeSessionKey"])){exit;}}
?>

