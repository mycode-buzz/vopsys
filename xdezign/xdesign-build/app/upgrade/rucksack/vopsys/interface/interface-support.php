<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class interface_support extends interface_legacy{    

    function __construct() {                        
        
        parent::__construct();                                        
    }

    function fn_addMetaData(){            
        return $this->obj_rowzAPI->fn_addMetaData();                                                
    }
    function fn_addMetaUser(){            
        return $this->obj_rowzAPI->fn_addMetaUser();                                                        
    }
}//END OF CLASS


?>