<?php
/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/header.php";
/////////////////////////HEADER

class page extends server_interface{
  function __construct() {          
    parent::__construct();      

    //used by crud
  } 
  function fn_initialize() {            
    parent::fn_initialize();       
    
    //initalization code needs to remain here rather than in the consturctor, due to object hierachy functions
    //$this->fn_varDump($this->obj_post, "obj_post");

    $this->bln_debugAction=false;                  
    
    
}       
}//END OF CLASS

/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/footer.php";
/////////////////////////FOOTER
?>