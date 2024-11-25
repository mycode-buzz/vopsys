<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class interface_patch extends interface_delete{
    function __construct() {                        
        
        parent::__construct();                                        
    }

    function fn_callAPIPatch($obj_metaView, $int_idRecord, $obj_requestBody){          

        $str_requestBody=json_encode($obj_requestBody);            
        
        $obj_param=$this->obj_rowzAPI->fn_getRequest();                                             
        $obj_param->view_id=$obj_metaView->obj_param->MetaViewId;                                                                        
        $obj_param->cancel_get=true;                 
        $obj_param->row_matchid=$int_idRecord;         
        $obj_param->get_fqsn=true;                 

        $this->obj_rowzAPI->fn_buildEndPoint($obj_param);               

        if(empty($int_idRecord)){
            
            $this->fn_setError("fn_callAPIPatch RecordId is blank [".$int_idRecord."]. ViewId [".$obj_metaView->obj_param->MetaViewId."]");    

            /*
            $this->fn_varDump($int_idRecord, "int_idRecord", true);                                                                                                                          
            $this->fn_varDump($obj_param->str_urlEndpoint, "PATCH obj_param->str_urlEndpoint", true);    
            $this->fn_varDump($obj_requestBody, "obj_requestBody", true);        
            $this->fn_varDump($str_requestBody, "str_requestBody", true);                            
            //*/
            
            //leave exit in place
            exit;
            //leave exit in place
        }

        
        /*
        $this->fn_varDump($obj_param->str_urlEndpoint, "POST obj_param->str_urlEndpoint", true);
        $this->fn_varDump($int_idRecord, "int_idRecord", true);                                                                                                                          
        $this->fn_varDump($obj_requestBody, "obj_requestBody", true);        
        $this->fn_varDump($str_requestBody, "str_requestBody", true);                
        $this->fn_varDumpPost();                
        exit;
        //*/          

        
        $str_response=$this->obj_rowzAPI->fn_patch($obj_param->str_urlEndpoint, $str_requestBody);                                                                
        //$this->fn_varDump($str_response, "str_response", true);          
        //exit;
        
        $obj_response=json_decode(strval($str_response));                                           
        if(!$this->fn_validateJSONDecode($obj_response, "[Interface Patch]"))exit;
        return $obj_response;
    }  
      
}//END OF CLASS


?>