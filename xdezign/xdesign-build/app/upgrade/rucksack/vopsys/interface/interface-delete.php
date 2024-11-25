<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class interface_delete extends interface_list{
    function __construct() {                        
        
        parent::__construct();                                        
    }

    
    function fn_runRecycleRecord(){ 
        
        $this->obj_metaView=new metaView($this);
        $this->obj_metaView->fn_initialize($this->MetaDataViewId);

        
        
        ////////////////////
        $obj_param=new stdClass;                            
        $obj_param->MetaColumnAPIName="ArchiveDate";                    
        $obj_param->MetaColumnValue=$this->str_runtime;                                                        
        $obj_requestBody=$this->obj_metaView->fn_getAPIPatchRequestBody($obj_param);                             
        
        $this->fn_varDump($obj_requestBody, "obj_requestBody", true);        
        
        $int_idRecord=$this->obj_post->MetaKeyColumnValue;                
        $obj_callBack=$this->fn_callAPIPatch($this->obj_metaView, $int_idRecord, $obj_requestBody);

        $bln_debug=$this->DebugServer;
        $bln_debug=false;
        $this->fn_validateAPICallBack($obj_callBack, $bln_debug);      
        
        
    }   
    
    
       
      
}//END OF CLASS


?>