<?php
//*

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

/////////////////////////HEADER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/header.php";
/////////////////////////HEADER

class page extends server_interface{

  function __construct() {              
    parent::__construct();  
    
    //used by simple menu    
  }    
  
  function fn_initialize() {           
    
    parent::fn_initialize();                
    //initalization code needs to remain here rather than in the consturctor, due to object hierachy functions              

    
                            
    $this->bln_debugAction=false;
    
  }  

}//END OF CLASS

/////////////////////////FOOTER
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/footer.php";
/////////////////////////FOOTER
//*/
?>