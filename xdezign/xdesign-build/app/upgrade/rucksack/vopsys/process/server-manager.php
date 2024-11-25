<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE


///////////////////////////SERVERMANAGER
class servermanager extends pushColumnz{  
  function __construct() {      
    parent::__construct();       
  }  
  
  function fn_setLokalDomain($str_subDomain=false){       

    $this->bln_localHost=false;
    $this->str_lokalDomain="rowz.app";
    $this->str_lokalProtocol="https://";
    if (isset($_SERVER["REMOTE_ADDR"])) {if($_SERVER["REMOTE_ADDR"]==="127.0.0.1"){
      $this->bln_localHost=true;
      $this->str_lokalDomain="lokal-mycode.buzz";
      $this->str_lokalProtocol="http://";          
    }}
    $this->str_lokalURL=$this->str_lokalProtocol.$this->str_lokalDomain;        
    if(!empty($str_subDomain)){
        $this->str_activeSubdomainURL=$this->str_lokalProtocol.$str_subDomain.".".$this->str_lokalDomain;
    }
    else{
        $this->str_activeSubdomainURL=$this->str_lokalURL;
    }
  }


  function fn_initialize(){    
    
    /////////////////////////
    global $obj_serverpost;

    $this->obj_serverpost=$obj_serverpost;             
    
    $obj_post=$this->obj_post=$obj_serverpost->obj_post;             
    
    $this->str_runtime=$this->fn_getSQLDate();      
    $this->date_runtime=$this->fn_getDateFromString($this->str_runtime);
    //$this->str_subDomain=explode('.', $_SERVER['HTTP_HOST'])[0];//this is now on obj post
    /////////////////////////      

    /////////////////////////
    $this->fn_setLokalDomain();
    $this->str_UniqueName=$this->fn_getUniqueName();                
    /////////////////////////        

    $this->fn_initializeServerPost();

    //After ServerPost
    parent::fn_initialize();                                
    
  }

  function fn_initializeServerPost(){
    $obj_post=$this->obj_post;
    
    if(empty($obj_post->DebugServer)){        
      $obj_post->DebugServer=false;                
      //$this->fn_addEcho("obj_post->DebugServer is empty");
    } 
    else{
      //$this->fn_addEcho("obj_post->DebugServer is NOT empty: ".$obj_post->DebugServer);                  
    }   
    $this->DebugServer=$obj_post->DebugServer;
    //$this->DebugServer=false;
    //$this->fn_addMessage("DebugServer  ".$this->DebugServer);                      
    
    //TURN ON HERE DEBUG PIN
    //TURN ON HERE DEBUG PIN
    if(!empty($this->DebugServer)){
      //$this->bln_debugExecute=true;              
    }
    //TURN ON HERE DEBUG PIN
    //TURN ON HERE DEBUG PIN


    
    
  } 
  
  function random_str(
    $length,
    $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
) {

  /**
 * Generate a random string, using a cryptographically secure 
 * pseudorandom number generator (random_int)
 * 
 * For PHP 7, random_int is a PHP core function
 * For PHP 5.x, depends on https://github.com/paragonie/random_compat
 * 
 * @param int $length      How many characters do we want?
 * @param string $keyspace A string of all possible characters
 *                         to select from
 * @return string
 */

    $str = '';
    $max = mb_strlen($keyspace, '8bit') - 1;
    if ($max < 1) {
        throw new Exception('$keyspace must be at least two characters long');
    }
    for ($i = 0; $i < $length; ++$i) {
        $str .= $keyspace[random_int(0, $max)];
    }
    return $str;
}

  
  
}//END CLASS  
  ///////////////////////////SERVERMANAGER