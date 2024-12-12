<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE


///////////////////////////DATAFUNCTION
class interface_support {  
  function __construct() {          
      
    }    

    function fn_initialize() {                           
  }

  function fn_isObjectEmpty($obj_my){

    if (!is_object($obj_my)) {
        if(empty($obj_my)){
            return true;
        }
        return false;
    }

    if (empty(get_object_vars($obj_my))) {
        return true;
    } else {
        return false;
    }
  }

  function fn_addMetaData(){            
    return $this->obj_rowzAPI->fn_addMetaData();                                                
}
function fn_addMetaUser(){            
    return $this->obj_rowzAPI->fn_addMetaUser();                                                        
}

function fn_getArrayMember($arr_my, $str_label){
    
    if(empty($arr_my[$str_label])){
        $str_label=strtolower($str_label);     
    }
    
    return $arr_my[$str_label];             
}
    
    function fn_getArrayItem($arr, $str_name){

      if(empty($arr[$str_name])){$arr[$str_name]="";}
      return $arr[$str_name];
    }    

    function fn_getUnique($length = 10) {      
      $characters = 'abcdefghijklmnopqrstuvwxyz';
      $charactersLength = strlen($characters);
      $randomString= '';
      for ($i = 0; $i < $length; $i++) {
          $randomString .= $characters[rand(0, $charactersLength - 1)];
      }
      return $randomString;
  }
    
  
    function fn_navigateSubdomain($str_subdomain){         
      
      $URL=$this->fn_getSubdomainURL($str_subdomain);      
      header("Location: ".$URL);
    }
    function fn_getSubdomainURL($str_subdomain){         
      
      $pieces = explode(".", $_SERVER['HTTP_HOST']);
      $pieces[0]=$str_subdomain;
      $HTTP_HOST=implode(".", $pieces);          
      $URL=$this->fn_getPageURLHTTP();
      $URL.=$HTTP_HOST;        
      return $URL;      
    }
    function fn_getPageURLHTTP() {            
  
      $HTTPS=$this->fn_getArrayItem($_SERVER, "HTTPS");        
      
      $str="http";
      if($HTTPS==='on'){
        $str.="s";
      }    
      $str.="://";    
      return $str;
    }
  
    function fn_getPageURL() {                        
      
      $URL=$this->fn_getPageURLHTTP();    
      $URL.=$_SERVER['HTTP_HOST'];
      $URL.=$_SERVER['REQUEST_URI'];
      return $URL;
    }
    
    function fn_checkDefaultEntry(){
    }
  
    function fn_execute() {        
      $this->fn_initialize();            
      $this->fn_executePage();
      $this->fn_destruct();    
    }
    function fn_executePage(){   
      
      $this->fn_checkDefaultEntry();  
    }

    
    
    
    function fn_cancelEcho(){
      //note one argument only permissible
      $this->obj_post->bln_cancelEcho=true;          
    } 

    function fn_setResponse($obj_response){
      //note one argument only permissible
      $this->obj_post->Response=$obj_response;                    
    }
  
    function fn_setError($str_message){
      //note one argument only permissible
      $this->obj_post->HasError=true;        
      $this->obj_post->ErrorMessage.=$str_message.PHP_EOL.PHP_EOL;                
      exit;
    }
    
    function fn_setErrorLogin($str_message){    
      $this->obj_post->HasLoginError=true;            
      $this->fn_setError($str_message);
    } 
    
    function fn_setHTTPError($int_code, $str_message="NO FURTHER INFORMATION"){
      switch($int_code){
          case 500:
              $this->fn_setError("500: INTERNAL SERVER ERROR [".$str_message."]");
              break;
          default:
          $this->fn_setError("HTTP ERROR");
      }
      exit;

  }
  
      
    
    function fn_setSessionError($str_message){
      //note one argument only permissible
      $this->obj_post->HasSessionError=true;      
      $this->obj_post->ErrorMessage=$str_message;                    
    } 
    function fn_addMessage($str_message, $foo_value=false){      
      $this->fn_setMessage($str_message, $foo_value);
    }
    function fn_setMessage($str_msg, $foo_val=""){
      
      //note one argument only permissible
      if(empty($str_msg)){
        return;            
      }
      if(!empty($foo_val)){
        $str_msg.=": ".$foo_val;
      }      
      
      $obj_post=$this->obj_post;      
      $obj_post->HasMessage=true;        
      $obj_post->Message.=$str_msg.PHP_EOL.PHP_EOL;                      
    } 
 
    function xfn_addConsole($str_msg, $foo_val=""){      

      
      if(empty($str_msg)){
        return;              
      }

      if(!empty($foo_val)){
        $str_msg.=": ".$foo_val;
      }            
      
      $obj_post=$this->obj_post;            
      $obj_post->HasMessageConsole=true;        
      $obj_post->MessageConsole.=$str_msg.PHP_EOL.PHP_EOL;                
    } 

    function fn_removeArrayMatch($arr_haystack, $arr_needle) {
      // Use array_diff() to find elements in $arr_haystack that are not in $arr_needle
      $result = array_diff($arr_haystack, $arr_needle);
      
      // Re-index the resulting array starting from 1
      $result = array_values($result);
      
      return $result;
  }

  function fn_removeArrayContaining($array, $stringToRemove) {
    foreach ($array as $key => $value) {
        if (strpos($value, $stringToRemove) !== false) {
            unset($array[$key]);
        }
    }
    return array_values($array); // Re-index the resulting array
}


function fn_blankSession($str_name){
  $this->fn_setSession($str_name, "");                      
}     

function fn_setSession($str_name, $str_value){

  $_SESSION[$str_name]=$str_value;
}

function fn_getSession($str_name){
  
  if(empty($_SESSION[$str_name])){            
      $_SESSION[$str_name]="";    
  }  
  return $_SESSION[$str_name];
}


function fn_setCookie($cookie_name, $cookie_value, $bln_expire=false){      
  
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

function fn_addPre($str_msg, $foo_val=false) {
  $this->fn_varPre($str_msg, $foo_val);
}

function fn_varPre($str_msg, $foo_val=false) {
  if(empty($foo_val)){
    $foo_val="empty";
  }
  $str_val=$foo_val;
  echo '<pre>';  
  print_r($str_msg.": ");
  print_r($foo_val);
  echo '</pre>';
}

function fn_getParameterFromUrl($url, $parameterName) {
  
  $parsedUrl = parse_url($url);
  $query = $parsedUrl['query'] ?? '';

  $params = explode('&', $query);
  foreach ($params as $param) {
      list($key, $value) = explode('=', $param);
      if ($key === $parameterName) {
          return $value;
      }
  }

  return null;
}
    
    
    function fn_getCookie($cookie_name){
        
      $str_value="";
      if(!isset($_COOKIE[$cookie_name])) {        
      } 
      else {
        $str_value=$_COOKIE[$cookie_name];        
      }
      return $str_value;
    }      
  
    function fn_getSQLDate(){
      return date("Y-m-d H:i:s");
    }
    function fn_getUniqueName(){
      return date("Y-m-d-H-i-s-").rand(0,100);
    } 
  
    function fn_addEcho($str_msg, $foo_val="", $bln_console=false){

      $this->fn_varDump($foo_val, $str_msg, true);      
    }
  
    
    function fn_addConsoleServer(){    
  
      $this->fn_addConsole("START fn_addConsoleServer");
  
      foreach ($_SERVER as $key=>$val )
      {
        $this->fn_addConsole($key.": ".$val);
      }
  
      $this->fn_addConsole("END fn_addConsoleServer");
    }
  
    function fn_varDumpAPI($foo_val=false, $str_message="DUMP", $bln_console=false){            
      $this->fn_varDump($foo_val, $str_message, true);      
  }      
    function fn_varDumpPost(){
      
      $str_obj=json_encode($this->obj_post);
      $obj_debug=json_decode($str_obj);
      $obj_debug->MessageConsole="";
      $obj_debug->Echo="";
      $this->fn_varDump($obj_debug, "OBJ POST", true);
    


    }

   
    
    function fn_varDump($foo_val=false, $str_msg="DUMP", $bln_console=true){                      
      
      $str_val=var_export($foo_val, true);      
      if($bln_console){
        $this->fn_addConsole($str_msg."[DUMP]: ".$str_val);    
      }      
    }

    function fn_addConsole($str_msg, $foo_val=""){      
       
      if(empty($str_msg)){
        return;              
      }

      if(!empty($foo_val)){
        //$str_val=print_r($foo_val, true);      
        $str_val=var_export($foo_val, true);      
        //$str_val="123";
        $str_msg.=": ".$str_val;
      }            
      
      $obj_post=$this->obj_post;            
      $obj_post->HasMessageConsole=true;        
      $obj_post->MessageConsole.=$str_msg.PHP_EOL.PHP_EOL; 
                      
    } 
    
    
    function fn_isObject($obj){
      if(gettype($obj)==="object"){return true;}
      return false;
    } 
    function fn_replace($needle,$replace,$haystack,$count=null){
      
      return str_replace($needle,$replace,$haystack,$count);    
    }

    function fn_replaceFirst($input, $search, $replace) {
      $pos = strpos($input, $search);
      if ($pos !== false) {
          // Replace the first occurrence
          $input = substr_replace($input, $replace, $pos, strlen($search));
      }
      return $input;
  }

  function fn_array_search($str_searchfor, $arr_search){

    $bln_match=false;    
    foreach($arr_search as $str_my=>$str_value){                    
        if($str_my==$str_searchfor){
            $bln_match=true;
        }
    }
    return  $bln_match;
  }
  function fn_getDateFromString($dateString){
    return  DateTime::createFromFormat("Y-m-d H:i:s", $dateString);
  }
  
  function removeBeforeLastCharacter($input, $character) {
    return $character.(preg_replace('/^.*' . preg_quote($character, '/') . '/', '', $input));
  }

  function fn_trimBoth($inputString, $wordToTrim) {
    // Create a regular expression pattern to match the specified word at the start or end
    $pattern = "/^{$wordToTrim}|{$wordToTrim}$/i"; // The 'i' flag makes it case-insensitive
  
    // Replace occurrences of the word at the start or end with an empty string
    return preg_replace($pattern, '', $inputString);
  }

  function fn_trimEnd($inputString, $wordToTrim) {
    // Create a regular expression pattern to match the specified word at the start or end
    $pattern = "/{$wordToTrim}$/i"; // The 'i' flag makes it case-insensitive    

    // Replace occurrences of the word at the start or end with an empty string
    return preg_replace($pattern, '', $inputString);
  }

  function fn_trimStart($inputString, $wordToTrim) {
    // Create a regular expression pattern to match the specified word at the start or end
    $pattern = "/^{$wordToTrim}/i"; // The 'i' flag makes it case-insensitive

    // Replace occurrences of the word at the start or end with an empty string
    return preg_replace($pattern, '', $inputString);
  }

  function fn_parseViewId($str_key){
    $str_viewId="";
    if(!empty($str_key) && $this->fn_inString($str_key, ".")){
        $arr_key=explode(".", $str_key);        
        $str_viewId=$arr_key[0];
    }
    return $str_viewId;    
}



  function fn_getList($arr_item){
    return "'".implode("','", $arr_item)."'";        
  }
  

  function fn_isComposedOfChar($string, $char) {
    // Escape the character for use in a regular expression
    $escapedChar = preg_quote($char, '/');
    // Use preg_match to check if the string is composed only of the specified character
    return preg_match("/^[$escapedChar]*$/", $string);
  }

  function fn_inString($str_haystack, $str_needle){

    $int_pos=strpos($str_haystack, $str_needle);
    if($int_pos===false){return false;}
    else return true;
  }

  function fn_deepCopy($my_obj){
    $new_obj = json_encode($my_obj);
    return  json_decode($new_obj);
  }

  function fn_stripSpace($str){    
    return preg_replace('/\s+/', '', $str);
  } 

  function fn_mergeList($str_1, $str_2, $str_listSeparator){        
        
    $arr_1=[];
    if(!empty($str_1)){
        $arr_1=explode($str_listSeparator, $str_1);
    }        

    $arr_2=[];
    if(!empty($str_2)){
        $arr_2=explode($str_listSeparator, $str_2);
    }                
    
    $arr=array_merge(
        $arr_1,
        $arr_2
    );                                

    $str=implode($str_listSeparator, $arr);
    return $str;
  }
  function fn_validateJSONDecode($arr, $str_msg=""){
    if(is_null($arr)){
        $this->fn_setError("NULL Array found. ".$str_msg);
        return false;
    }        
    return true;
  }
  
    //END SQL FUNCTION
}//END CLASS  
  ///////////////////////////DATAFUNCTION