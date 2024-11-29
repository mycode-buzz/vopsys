<?php

//This is the serverside counterpart of the clientside end session  "authorise_end"
$obj_post = json_decode(file_get_contents("php://input"));  
$obj_post->MessageConsole="";   

fn_addConsole("Authorise End");
//End all access
fn_blankSession("UserLoginSession");
fn_loginCookie("AuthorizeSessionKey", "", true);
fn_loginCookie("AuthorizeUserId", "", true);
//End all access

echo json_encode($obj_post);  

function fn_blankSession($str_name){
    $_SESSION[$str_name]="";
}     
function fn_loginCookie($cookie_name, $cookie_value, $bln_expire=false){      
  
    unset($_COOKIE[$cookie_name]);    
  
    $int_CookieStoreDays=28;
    
    if($bln_expire){
      $str_time=time() - 3600;
    }else{
      $str_time=time() + (86400 * $int_CookieStoreDays);    
    }
    
    $arr_domain = explode(".", $_SERVER['HTTP_HOST'], 2);          
    $arr_cookie_options = array (
      'expires' => $str_time,
      'path' => '/',
      'domain' => '.'.$arr_domain[1], 
      'secure' => false,     // or false
      'httponly' => false,    // or false
      'samesite' => 'Lax' // None || Lax  || Strict
      );
      
    setcookie($cookie_name, $cookie_value, $arr_cookie_options);
  }
  

function fn_varDump($foo_val=false, $str_msg=""){                      
    
    $str_val=var_export($foo_val, true);      
    fn_addConsole($str_msg.": ".$str_val);
  }
  function fn_addConsole($str_msg="", $foo_val=""){      
    
    if(!empty($foo_val)){      
      $str_val=var_export($foo_val, true);            
      $str_msg.=": ".$str_val;
    }            
    
    global $obj_post;    
    $obj_post->HasMessageConsole=true;            
    $obj_post->MessageConsole.=$str_msg.PHP_EOL.PHP_EOL;                     
  } 

?>