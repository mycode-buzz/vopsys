<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/header.php";
/////////////////////////HEADER

/////////////////////////HEADER
require_once __DIR__."/package.php";
/////////////////////////HEADER


class page extends package{
  function __construct() {              
    parent::__construct();
  }            
  function fn_executePage() {            
    
    parent::fn_executePage();   
    
    

    $obj_post=$this->obj_post;                           
    
    switch($obj_post->Action){                             
        case "newProject":                              
            //$this->fn_newProject();          
          break;
      default:          
        $this->fn_setError("APP ACTION Not Handled: [".$obj_post->Action."]");          
        exit;
    }
  }
  
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////
  /////////////////////////////////

  
  function fn_newProject(){       
      
    //$this->fn_cleanupInstanceTable();      
    
    $obj_ini=new stdClass();
    $obj_ini->RecordId=0;           
    $obj_ini->bln_version=false;       
    
    $this->fn_packageProject($obj_ini);      
  }
  


  
}
/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/footer.php";
/////////////////////////FOOTER