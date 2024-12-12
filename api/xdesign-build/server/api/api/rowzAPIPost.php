<?php

class rowzAPIPost extends rowzAPIPatch{    

    function fn_post($url, $request_body=false, $bln_debug=false){

        //DO NOT REMOVE
        $this->bln_debug=$bln_debug;
        //DO NOT REMOVE

        
        /*
        $this->fn_varDump($url, "POST str_urlEndpoint", true);                        
        $this->fn_varDump($request_body, "request_body", true);                                    
        //*/    

        /*
        {"101437.company":"COMPDAV"}        
        //*/
        
        
        $this->fn_callInit($url, "POST", $request_body);
        

        //EARLY RETURN
        if($this->response->status_code!==200){
            $this->fn_writeResponse();                        
            return $this->obj_call->str_response;    
        }
        //EARLY RETURN        
        
        if($this->obj_call->request_body===""){                        
            $this->response->status_code=400;                
            $this->response->status_message="Bad Request [request_body is empty]";                                        
        }             
        
        //EARLY RETURN
        if($this->response->status_code!==200){
            $this->fn_writeResponse();                        
            return $this->obj_call->str_response;    
        }
        //EARLY RETURN
        
        //SET REQUIRED AREAS
        $this->fn_setSQLSource();                        
        //SET REQUIRED AREAS                        

        //EARLY RETURN
        if($this->response->status_code!==200){
            $this->fn_writeResponse();                        
            return $this->obj_call->str_response;    
        }
        //EARLY RETURN

        
        $this->fn_postData();      
        
        //EARLY RETURN
        if($this->response->status_code!==200){
            $this->fn_writeResponse();                        
            return $this->obj_call->str_response;    
        }
        //EARLY RETURN

        $this->response->status_code=200;                
        $this->response->status_message="OK";                  
        $this->fn_writeResponse();                    
        return $this->obj_call->str_response;
    }    
    
    function fn_postData(){

        
        
        $obj_call=$this->obj_call;                
        $obj_metaView=$obj_call->obj_metaView;        
        $obj_paramView=$obj_metaView->obj_param;                      
        
        $str_labelField="POST";
        $this->arr_nameQuery=[];
        $this->arr_valueQuery=[];
        $obj_jsonOperator=new jsonOperator($this, $str_labelField);
        $obj_jsonOperator->obj_metaView=$obj_metaView;
        $obj_jsonOperator->fn_parseQuery($obj_call->request_body);                
        $obj_call->str_rowRequestSQL=$obj_jsonOperator->str_sql;//not used in post
        //$this->fn_varDump($obj_call->str_rowRequestSQL, "obj_call->str_rowRequestSQL", true);                        
        
        
        /*
        if($this->bln_debug){
            $this->response->status_code=500;                
            $this->response->status_message="ABCD".PHP_EOL;          
            $this->response->status_message.=$this->fn_varExportAPI($this->arr_nameQuery).PHP_EOL;          
            $this->response->status_message.=$this->fn_varExportAPI($this->arr_valueQuery).PHP_EOL;          
            
            //return;    
        }
        //*/
        
        //SET MAIN SELECT
        $obj_metaView=$obj_call->obj_metaView;
        $obj_bodyHolder=$obj_metaView->fn_addBodyColumn($this->arr_nameQuery, $this->arr_valueQuery, $obj_call->str_rowRequestSQL, $str_labelField);
        //$this->fn_varDump($obj_bodyHolder, "obj_bodyHolder", true);        
        
        /*
        if($this->bln_debug){
            $this->response->status_code=500;                
            //$this->response->status_message="AAA".PHP_EOL;          
            return;    
        }
        //*/
        
        $arr_nameField=$obj_bodyHolder->arr_nameField;              
        $arr_labelField=$obj_bodyHolder->arr_labelField;
        $arr_valueField=$obj_bodyHolder->arr_valueField;
        
        
        
        /*
        //$this->fn_varDump($arr_nameField, "arr_nameField", true);                        
        //$this->fn_varDump($arr_labelField, "arr_labelField", true);                      
        //$this->fn_varDump($arr_valueField, "arr_valueField", true);                              
        //*/
        
        //$this->fn_varDump($obj_call->str_rowRequestSQL, "obj_call->str_rowRequestSQL", true);                
        
        //SET MAIN SELECT                
        
        $str_sql="INSERT INTO `$obj_paramView->MetaSchemaName`.`$obj_paramView->MetaTableName` (";        
        $arr_row=$arr_nameField;                
        foreach ($arr_row as $str_key => $str_value) {
            //check key length etc
            //add to field list
            $str_sql.="$str_value,";                                    
        }

        $str_sql=trim($str_sql, ",");
        $str_sql.=") ";

        //$this->fn_varDump($str_sql, "str_sql", true);       
        
        
        
        $str_sql.=" VALUES ";
        $int_count=0;
        $arr_value=[];
        $str_sql.="(";
        
        $arr_row=$arr_labelField;                
        foreach ($arr_row as $str_key => $str_value) {
            //check value length etc
            //add to field list                        
            $str_sql.=":$str_value,";
          
        }
        $str_sql=trim($str_sql, ",");
        $str_sql.=") ";   
        $obj_call->arr_param=array_merge($arr_valueField);        
        $str_sql.=";";       

        //$this->fn_varDump($str_sql, "str_sql", true);       



       
        $this->fn_executeSQLStatement($str_sql,  $obj_call->arr_param);                
        
        $int_recordId=$this->fn_getLastInsertId();
        //$this->fn_varDump($int_recordId, "int_recordId", true);
        //$this->fn_varDump($this->obj_post, "this->obj_post", true);

        /*
        if($this->bln_debug){

            return;
        }
        //*/

        $int_idRecordMeta=0;

        if($obj_paramView->MetaViewId==$this->MetaLinkViewId){
        }
        else{

            $MetaPermissionStamp=$this->fn_getMetaPermissionStamp();
            
            
            //CREATE META DATA
            $obj_param=new stdClass;                  
            $obj_param->MetaDataSystemId=$this->obj_userLogin->MetaUserSystemId;
            $obj_param->MetaDataOwnerId=$this->obj_userLogin->MetaUserId;
            $obj_param->DataSchemaName=$obj_paramView->MetaSchemaName;            
            $obj_param->DataTableName=$obj_paramView->MetaTableName;
            $obj_param->DataKeyName=$obj_paramView->MetaTableKeyField;
            $obj_param->DataKeyValue=$int_recordId;
            $obj_param->MetaPermissionTag=$MetaPermissionStamp;            
            $obj_metaData=new metaData($this);                       
            $int_idRecordMeta=$obj_metaData->fn_createRecord($obj_param);       
                                         
            //CREATE META DATA                         
        }

        //SET LATEST RECORD FOR RETURN        
        $this->fn_setDefaultResponse($int_recordId, $int_idRecordMeta);            
        //SET LATEST RECORD FOR RETURN                
    }
     
}//end of class