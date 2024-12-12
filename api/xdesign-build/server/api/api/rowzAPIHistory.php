<?php

class rowzAPIHistory{       
    
    function fn_getFieldHistory($obj_param){        

        if($obj_param->MetaSchemaName==="meta_data" && $obj_param->MetaTableName==="meta_data"){
            return false;
            //no need to create archive field level history.
            //to do  record when a row was archived in sepaerate log.
        }
        
        
        $str_sql="SELECT $obj_param->str_nameField FROM $obj_param->str_sqlSource WHERE $obj_param->str_whereCriteria;";        
        //$this->fn_varDump($str_sql);        
        $arr_row=$this->fn_fetchRow($str_sql, $this->obj_call->arr_metaWhere);//see params added eg fn_getAPIMetaPermissionTagSQL
        //*
        if(empty($arr_row)){
            return false;
        }
        //*/
        $obj_param->HistoryFieldName = array_key_first($arr_row);
        $obj_param->HistoryFieldValue = $arr_row[$obj_param->HistoryFieldName];        
        return $obj_param;
    }
    function fn_createFieldHistory($obj_param){        


        $str_sql="INSERT INTO  `meta_history`.`meta_history` 
        (
        `MetaHistorySystemId`,
        `MetaHistoryOwnerId`,
        `HistoryViewId`,        
        `HistoryKeyName`,
        `HistoryKeyValue`,        
        `HistorySchemaName`,
        `HistoryTableName`,
        `HistoryFieldName`,
        `HistoryFieldValue`,
        `ModifiedDate`, `ModifiedBy`, `CreatedDate`, `CreatedBy`
        )
        VALUES
        (
        :MetaHistorySystemId,
        :MetaHistoryOwnerId,
        :HistoryViewId,        
        :HistoryKeyName,
        :HistoryKeyValue,
        :HistorySchemaName,
        :HistoryTableName,
        :HistoryFieldName,
        :HistoryFieldValue,        
        :ModifiedDate,:ModifiedBy,:CreatedDate,:CreatedBy
        )
        ;";                

        

        $stmt=$this->fn_executeSQLStatement($str_sql,  [
            'MetaHistorySystemId'=>$this->obj_userLogin->MetaUserSystemId,
            'MetaHistoryOwnerId'=>$this->obj_userLogin->MetaUserSystemId,
            'HistoryViewId'=>$obj_param->MetaViewId,            
            'HistoryKeyName'=>$obj_param->MetaKeyName,
            'HistoryKeyValue'=>$obj_param->MetaKeyValue,
            'HistorySchemaName'=>$obj_param->MetaSchemaName,        
            'HistoryTableName'=>$obj_param->MetaTableName,        
            'HistoryFieldName'=>$obj_param->HistoryFieldName,
            'HistoryFieldValue'=>$this->fn_trimTo($obj_param->HistoryFieldValue, 100),
            'ModifiedDate'=>$this->str_runtime,        
            'ModifiedBy'=>$this->obj_userLogin->MetaUserId,
            'CreatedDate'=>$this->str_runtime,        
            'CreatedBy'=>$this->obj_userLogin->MetaUserId            
        ]);   
    }
    
}

    