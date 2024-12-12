<?php

/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

class interface_push extends interface_autojoin{
    function __construct() {                        
        
        parent::__construct(); 
                                               
    }
    
    function fn_runPushColumn(){        
        
        $obj_paramColumn=new stdClass;                                            

        
        if($this->obj_post->ModeNewRecord){  
            
            $obj_paramColumn->MetaColumnAPIName=$this->obj_post->MetaColumnAPIName;                    
            $obj_paramColumn->MetaColumnValue=$this->obj_post->MetaColumnValue;        
            $obj_requestBody=$this->obj_metaView->fn_getAPIPostRequestBody($obj_paramColumn);                                                  

            
            
            $obj_callBack=$this->fn_callAPIPost($this->obj_metaView, $obj_requestBody);  
            $bln_debug=$this->DebugServer;
            //$bln_debug=true;
            
            $this->fn_validateAPICallBack($obj_callBack, $bln_debug);                      

            
            $int_idRecord=$this->obj_metaView->fn_getIdValue($obj_callBack);

            /*
            $this->fn_debugPost();
            $this->fn_varDump($obj_callBack, "yyyy obj_callBack", true);
            $this->fn_varDump($int_idRecord, "yyyy int_idRecord", true);            
            exit;
            //*/

            $this->obj_metaViewData=new metaView($this);
            $this->obj_metaViewData->fn_initialize($this->MetaDataViewId);
            $int_idRecordData=$this->obj_metaViewData->fn_getIdValue($obj_callBack);            
            $this->obj_post->MetaKeyColumnValue=$int_idRecord;//very important to allow ui to update key value !! 
            $this->obj_post->DataKeyColumnValue=$int_idRecordData;//very important to allow ui to update key value !! 
            
            if($this->obj_post->AutoJoinPin){                            

                $obj_paramFrom=new stdClass;
                $obj_paramFrom->MetaViewId=$this->obj_metaView->obj_param->MetaViewId;                                
                $obj_paramFrom->KeyName=$this->obj_metaView->obj_param->MetaTableKeyField;
                $obj_paramFrom->KeyValue=$int_idRecord;                                
                $obj_paramTo=$this->fn_getJoinToSource();                
                $this->fn_insertAutoJoin($obj_paramFrom, $obj_paramTo);
            }            
        }
        else{                      
            
            //$this->fn_varDumpPost();            
            $obj_paramColumn->MetaColumnAPIName=$this->obj_post->MetaColumnAPIName;
            $obj_paramColumn->MetaColumnValue=$this->obj_post->MetaColumnValue;                                                                    
            
            
            $obj_requestBody=$this->obj_metaView->fn_getAPIPatchRequestBody($obj_paramColumn);                                                    

            /*
            $this->fn_varDumpPost();
            $this->fn_varDump($obj_requestBody, "obj_requestBody", true);
            $this->fn_varDump($obj_column, "obj_column", true);            
            exit;
            //*/ 
            

            $obj_column=$obj_paramColumn->Column;           

            
            
            
            /*
            //$this->fn_varDumpPost();
            $this->fn_varDump($obj_requestBody, "obj_requestBody", true);
            //$this->fn_varDump($obj_column, "obj_column", true);            
            exit;
            //*/                                   

            
            $int_idRecord=$this->obj_post->MetaKeyColumnValue;                
            $obj_callBack=$this->fn_callAPIPatch($this->obj_metaView, $int_idRecord, $obj_requestBody);           
            
            
            $bln_debug=$this->DebugServer;
            //$bln_debug=true;
            $this->fn_validateAPICallBack($obj_callBack, $bln_debug);                                    
            
            
            
            $this->fn_interfaceAfterPatch($obj_paramColumn);                                    
        }                   
        
        if(!empty($obj_column->MetaList)){                        
            $this->fn_onPushProcessList($obj_column);
        }
    }    

    
    function fn_interfaceAfterPatch($obj_paramColumn){

        
        $obj_column=$obj_paramColumn->Column;        

        


        $bln_updateSessionPinAll=false;
        switch($obj_paramColumn->MetaColumnAPIName){
            case "CurrencySymbol"://system
            case "Credit"://system
            case "CreditExpiryDate"://system
            case "CreditName"://system
            case "FiscalYearEnd"://system
            case "MetaSystemStatus"://system
            case "MetaSystemName"://system
            case "MetaSystemUserId"://system          
                $bln_updateSessionPinAll=true;                
            break;
            default:
            break;
        }
        if($bln_updateSessionPinAll){                                
            $this->fn_updateSessionPinAll(true);
        }
        
        
        //$this->fn_varDumpPost();
        //$this->fn_varDump($obj_column, "obj_column", true);                                                    
        //$this->fn_varDump($int_idRecord, "int_idRecord", true);            
        //$this->fn_varDump($obj_callBack->response->history_fieldvalue, "obj_callBack->response->history_fieldvalue", true);                        
        
        switch((string)$this->obj_metaView->obj_param->MetaViewId){
            case (string)$this->MetaColumnViewId:

                $int_idMetaView=$this->obj_post->MarkedParentViewId;                        
                $obj_metaViewTarget=new metaView($this);                                                
                $obj_metaViewTarget->fn_initialize($int_idMetaView);                
                
                switch(strtolower($obj_column->MetaColumnName)){
                    case "metacolumnmame":                                                                                                                
                        $MetaColumnNameOld=$obj_callBack->response->history_fieldvalue;
                        $MetaColumnNameNew=$this->obj_post->MetaColumnValue;
                        $obj_metaViewTarget->fn_renameColumn($MetaColumnNameOld, $MetaColumnNameNew);
                    break;
                    case "metacolumntype":
                        $MetaColumnId=$this->obj_post->MetaKeyColumnValue;//12744                        
                        $obj_metaColumnTarget=new metaColumn($this);             
                        $obj_metaColumnTarget->fn_initialize($MetaColumnId);                                                                         
                        $MetaColumnTypeNew=$this->obj_post->MetaColumnValue;  
                        
                        $bln_success=$obj_metaColumnTarget->fn_changeType($MetaColumnTypeNew);                                                    
                        //$this->fn_varDump($bln_success, "type was changed?", true);
                        if($bln_success){
                            //$this->fn_addMessage("Type was changed to [$MetaColumnTypeNew]. Form will be refreshed.");                                                                                     
                            $this->bln_reloadSection=true;
                        }
                        else{
                            $this->fn_addMessage("Error : Type was not changed", $MetaColumnTypeNew);                              
                        }
                    
                    break;
                    case "metaoption":
                        $MetaColumnId=$this->obj_post->MetaKeyColumnValue;//12744                        
                        $obj_metaColumnTarget=new metaColumn($this);             
                        $obj_metaColumnTarget->fn_initialize($MetaColumnId);                                                                         
                        $MetaOption=$this->obj_post->MetaColumnValue;                          
                        $bln_success=$obj_metaColumnTarget->fn_changeOption($MetaOption);
                        /*
                        //$this->fn_varDump($bln_success, "type was changed?", true);
                        if($bln_success){
                            //$this->fn_addMessage("Type was changed to [$MetaColumnTypeNew]. Form will be refreshed.");                                                                                     
                            $this->bln_reloadSection=true;
                        }
                        else{
                            $this->fn_addMessage("Error : on Option change", $MetaOption);                              
                        }
                        //*/
                    
                    break;
                }

            break;
            default:
            break;
        }
    } 
      
}//END OF CLASS




?>