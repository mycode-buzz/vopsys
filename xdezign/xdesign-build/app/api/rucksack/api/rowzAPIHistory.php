<?php

class rowzAPIHistory{       
    
    function fn_getFieldHistory($obj_param){        
        
        $str_sql="SELECT $obj_param->str_nameField FROM $obj_param->str_sqlSource WHERE $obj_param->str_whereCriteria;";                                        
        $arr_row=$this->fn_fetchRow($str_sql);        
        $obj_param->HistoryFieldName = array_key_first($arr_row);
        $obj_param->HistoryFieldValue = $arr_row[$obj_param->HistoryFieldName];        
        
        return $obj_param;
    }
    function fn_createFieldHistory($obj_param){        

        $str_sql="INSERT INTO  `meta_history`.`meta_history` 
        (
        `MetaHistorySystemId`,
        `MetaHistoryOwnerId`,
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
        :HistorySchemaName,
        :HistoryTableName,
        :HistoryFieldName,
        :HistoryFieldValue,
        :ModifiedDate,
        :ModifiedBy,
        :CreatedDate,
        :CreatedBy
        )
        ;";                



        $stmt=$this->fn_executeSQLStatement($str_sql,  [
            'MetaHistorySystemId'=>$this->obj_userLogin->MetaUserSystemId,
            'MetaHistoryOwnerId'=>$this->obj_userLogin->MetaUserSystemId,
            'HistorySchemaName'=>$obj_param->MetaSchemaName,        
            'HistoryTableName'=>$obj_param->MetaTableName,        
            'HistoryFieldName'=>$obj_param->HistoryFieldName,
            'HistoryFieldValue'=>$obj_param->HistoryFieldValue,
            'ModifiedDate'=>$this->str_runtime,        
            'ModifiedBy'=>$this->obj_userLogin->MetaUserId,
            'CreatedDate'=>$this->str_runtime,        
            'CreatedBy'=>$this->obj_userLogin->MetaUserId            
        ]);   
    }
    
}

    