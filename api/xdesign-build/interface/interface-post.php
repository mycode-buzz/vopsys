<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class interface_post extends interface_patch{
    function __construct() {                        
        
        parent::__construct();                                        
    }

    function fn_callAPIPost($obj_metaView, $obj_requestBody, $bln_debug=false){
        
        $str_requestBody=json_encode($obj_requestBody);        
        
        $obj_param=$this->obj_rowzAPI->fn_getRequest();                                                     
        $obj_param->view_id=$obj_metaView->obj_param->MetaViewId;                                                                        
        $obj_param->cancel_get=true;                 
        $this->obj_rowzAPI->fn_buildEndPoint($obj_param);
        
        /*
        $this->fn_varDump($obj_param->str_urlEndpoint, "POST obj_param->str_urlEndpoint", true);                                                                                                                          
        $this->fn_varDump($obj_requestBody, "obj_requestBody", true);        
        $this->fn_varDump($str_requestBody, "str_requestBody", true);                
        exit;
        //*/                

        /*
        if($bln_debug){
            return;
        }
        //*/

        
        
        $str_response=$this->obj_rowzAPI->fn_post($obj_param->str_urlEndpoint, $str_requestBody, true);                                                                                
        
        /*
        $this->fn_varDump($str_response, "str_response", true);                
        exit;
        //*/

        $obj_response=json_decode(strval($str_response));                                           
        if(!$this->fn_validateJSONDecode($obj_response, "[Interface Post]"))exit;
        return $obj_response;
    }      
      
}//END OF CLASS


?>