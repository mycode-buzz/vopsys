<?php

class rowzAPIPatch extends rowzAPIHistory{       
    
    function fn_patch($url, $request_body=false, $bln_debug=false){        
        
        $this->fn_callInit($url, "PATCH", $request_body);
        
        //*
        //DEBUG
        //$this->fn_varDump($url, "PATCH str_urlEndpoint", true);                
        //$this->fn_varDump($request_body, "request_body", true);
        //$this->fn_varDump($this->obj_call, "this->obj_call", true);
        
        //$this->response->status_code=200;
        //$this->fn_writeResponse();                        
        //return $this->obj_call->str_response;
        //DEBUG
        //*/
        
        if($this->response->status_code!==200){
            $this->fn_writeResponse();                        
            return $this->obj_call->str_response;    
        }

        if($this->obj_call->request_body===""){                        
            $this->response->status_code=400;                
            $this->response->status_message="Bad Request [fn_patch request_body is empty]";                
        }                
        else if(empty($this->obj_call->row_matchid)){                        
            $this->response->status_code=400;                
            $this->response->status_message="Bad Request [fn_patch row_matchid is empty][".$this->obj_call->row_matchid."]";
        }

        if($this->response->status_code!==200){
            $this->fn_writeResponse();                        
            return $this->obj_call->str_response;    
        }

        

        
        

        
        //SET REQUIRED AREAS
        $this->fn_setRowMatchSQL();                        
        $this->fn_setSQLSource();                  
        
        //SET REQUIRED AREAS                    
        $this->fn_patchData();                  
        if($this->response->status_code!==200){
            $this->fn_writeResponse();                        
            return $this->obj_call->str_response;    
        }
        
        $this->response->status_code=200;                
        $this->response->status_message="OK";          
        $this->fn_writeResponse();                        
        return $this->obj_call->str_response;
    }    

    function fn_patchData(){        
        
        $obj_call=$this->obj_call;                
        $obj_metaView=$obj_call->obj_metaView;        
        $obj_paramView=$obj_metaView->obj_param;

        $str_labelField="PATCH";
        $this->arr_nameQuery=[];
        $this->arr_valueQuery=[];
        $obj_jsonOperator=new jsonOperator($this, $str_labelField);
        $obj_jsonOperator->str_connectorDefault=",";
        $obj_jsonOperator->obj_metaView=$obj_metaView;        
        $obj_jsonOperator->fn_parseQuery($obj_call->request_body);        
        
        $obj_call->str_rowRequestSQL=trim($obj_jsonOperator->str_sql, '()');
        //$this->fn_varDump($obj_call->str_rowRequestSQL, "obj_call->str_rowRequestSQL", true);                        
        
        /*
        $this->fn_varDump($this->arr_nameQuery, "this->arr_nameQuery", true);                
        $this->fn_varDump($this->arr_valueQuery, "this->arr_valueQuery", true);           
        //exit;
        //*/
        
        
        //SET MAIN SELECT
        $obj_metaView=$obj_call->obj_metaView;
        $obj_bodyHolder=$obj_metaView->fn_addBodyColumn($this->arr_nameQuery, $this->arr_valueQuery, $obj_call->str_rowRequestSQL, $str_labelField);
        //$this->fn_varDump($obj_bodyHolder, "obj_bodyHolder", true);                
        

        $arr_nameField=$obj_bodyHolder->arr_nameField;              
        $arr_labelField=$obj_bodyHolder->arr_labelField;
        $arr_valueField=$obj_bodyHolder->arr_valueField;
        
        /*
        $this->fn_varDump($arr_nameField, "arr_nameField", true);                        
        $this->fn_varDump($arr_labelField, "arr_labelField", true);                      
        $this->fn_varDump($arr_valueField, "arr_valueField", true);                              
        //*/

        
        
        //$this->fn_varDump($obj_call->str_rowRequestSQL, "obj_call->str_rowRequestSQL", true);                
        
        
        //SET MAIN SELECT                
        $str_whereCriteria=$this->fn_getWhereCriteria();        
        $obj_call->arr_param=array_merge(
            $obj_call->arr_metaWhere,             
            $obj_call->arr_valueQuery,
            $obj_bodyHolder->arr_valueField,
        );        
        
        //$this->fn_varDump($obj_call->str_sqlSource, "obj_call->str_sqlSource", true);                
        //$this->fn_varDump($str_whereCriteria, "str_whereCriteria", true);                
        //$this->fn_varDump($obj_call->arr_param, "obj_call->arr_param", true);                        

        
        
        //assuming one field update in one call
        $str_nameField=implode(",", $arr_nameField);
        $arr_valueField=implode(",", $arr_valueField);
        $obj_call->FieldName = $str_nameField;
        $obj_call->FieldValue = $arr_valueField;

        //GET HISTORY
        $obj_paramHistory = new StdClass;        
        $obj_paramHistory->MetaSchemaName=$obj_paramView->MetaSchemaName;
        $obj_paramHistory->MetaTableName=$obj_paramView->MetaTableName;        
        $obj_paramHistory->str_nameField=$str_nameField;
        $obj_paramHistory->str_sqlSource=$obj_call->str_sqlSource;
        $obj_paramHistory->str_whereCriteria=$str_whereCriteria;                                
        $obj_paramHistory=$this->fn_getFieldHistory($obj_paramHistory);        
        //GET HISTORY

        //CREATE HISTORY
        $obj_call->HistoryFieldName=$obj_paramHistory->HistoryFieldName;
        $obj_call->HistoryFieldValue=$obj_paramHistory->HistoryFieldValue;
        $this->fn_createFieldHistory($obj_paramHistory);
        //CREATE HISTORY

        
        $str_sql="UPDATE  ".$obj_call->str_sqlSource." SET ";        

        $str_sql.=$obj_call->str_rowRequestSQL." ";

        if(!empty($str_whereCriteria)){
            $str_sql.="WHERE $str_whereCriteria ";
        }
        
        $str_sql.=";";                        

        //$this->fn_varDump($str_sql, "str_sql");
        //$this->fn_varDump($obj_call->arr_param, "obj_call->arr_param");        
        
        if($obj_call->api_debug){
            //DEBUG
            //$this->fn_varDump($str_sql, "str_sql");
            //$this->fn_varDump($obj_call->arr_param, "obj_call->arr_param");        
            //return;                            
            //DEBUG
        }

        $this->fn_executeSQLStatement($str_sql,  $obj_call->arr_param);   

        $obj_columnRequiredEmpty=false;
        
        if($obj_paramView->MetaViewId==$this->MetaLinkViewId){
        }
        else{

        
            $int_idRecord=$obj_call->row_matchid;
            $ArchiveDate=NULL;                        

            $obj_columnRequiredEmpty=$obj_metaView->fn_getRequiredEmptyStatus($int_idRecord);            
            //$this->fn_varDump($int_idRecord, "int_idRecord", true);
            //$this->fn_varDump($obj_columnRequiredEmpty, "obj_columnRequiredEmpty", true);
            //exit;            
            
            if($obj_columnRequiredEmpty){
                //$ArchiveDate=$this->str_runtime;                
                $ArchiveDate=NULL;
            }                       
            else{   
                if(!empty($obj_call->data_delete_date)){
                    $ArchiveDate=$obj_call->data_delete_date;            
                }
            }

            //$ArchiveDate=NULL;
            
            //UPDATE META DATA            
            $obj_param=new stdClass;
            $obj_param->ModifiedDate=$this->str_runtime;
            $obj_param->ModifiedBy=$this->obj_userLogin->MetaUserId;
            $obj_param->ArchiveDate=$ArchiveDate;

            $obj_param->DataSchemaName=$obj_paramView->MetaSchemaName;
            $obj_param->DataTableName=$obj_paramView->MetaTableName;
            $obj_param->DataKeyName=$obj_paramView->MetaTableKeyField;
            $obj_param->DataKeyValue=$int_idRecord;

            if(!empty($this->obj_page)){
                //$this->obj_page->fn_varDump($obj_param, "obj_param", true);
            }
            
            $obj_metaData=new metaData($this);
            $obj_metaData->fn_updateRecord($obj_param);
            //UPDATE META DATA                         
        }

        //SET LATEST RECORD FOR RETURN
        if(!empty($obj_call->row_matchid)){                        
            $this->fn_setDefaultResponse($obj_call->row_matchid, 0, $obj_columnRequiredEmpty);                        
        }
        //SET LATEST RECORD FOR RETURN
    }
}//end of class