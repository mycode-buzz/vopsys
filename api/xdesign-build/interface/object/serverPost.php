<?php
/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

///////////////////////////SERVERPOST
class serverpost{  
    function __construct() {      

      $this->obj_post=NULL;
  
      $obj_post=new stdClass();
      $str_json= file_get_contents("php://input");    
      if(!empty($str_json)){
        $obj_post = json_decode($str_json);              
      }
      if(is_null($obj_post)){
        exit;
      }
      if(!$this->fn_isObject($obj_post)){$obj_post=new stdClass;}                            
      
      if(!isset($obj_post->ServerIndex)) {              
        $obj_post->ServerIndex=false;        
      }

      $obj_post->bln_cancelEcho=false;      
      
      
      $this->obj_post=$obj_post; 
      
      if(empty($obj_post->HasError)){
        $obj_post->HasError=false;
      }
      if(empty($obj_post->ErrorMessage)){
        $obj_post->ErrorMessage="";
      }         
      if(empty($obj_post->Message)){
        $obj_post->Message="";
      }                    
      if(empty($obj_post->MessageConsole)){
        $obj_post->MessageConsole="";
      }                               
                

      if(empty($obj_post->DesignId)){$obj_post->DesignId="DesignIdNotSet";}           
        
        if(!isset($obj_post->Action)) {              
          $obj_post->Action="ACTION_SERVERPOST";
        }
  
        if(!isset($obj_post->Direction)) {              
          $obj_post->Direction="ERROR_SERVERPOST";
        }
  
        if(!isset($obj_post->RecordId)) {              
          $obj_post->RecordId="0";
        }
        
         
  
        if(!isset($obj_post->ObjectData)) {              
          $obj_post->ObjectData="[{}]";
        }
  
        if(!isset($obj_post->RowData)) {              
          $obj_post->RowData="[{}]";
        }
        
        
  
        if(!isset($obj_post->Echo)) {              
          $obj_post->Echo="";
        }
    } 
    
    function fn_isObject($obj){
      if(gettype($obj)==="object"){return true;}
      return false;
    } 
  }//END CLASS 
  ///////////////////////////KEEP AT TOP
  $obj_serverpost=new serverpost();
  
  register_shutdown_function('fn_shutdown');
  function fn_shutdown(){
    global $obj_serverpost, $obj_post;       
    $obj_post=$obj_serverpost->obj_post;    
    if($obj_post->bln_cancelEcho){return;}        
    echo json_encode($obj_post);  
  }
  ///////////////////////////SERVERPOST