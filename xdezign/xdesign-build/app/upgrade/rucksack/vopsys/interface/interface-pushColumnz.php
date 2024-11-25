<?php
/////////////////////////AUTHORISE
require_once VOPSYSROOT . "/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE


class pushColumnz extends childrowz{
    function __construct() {             
        parent::__construct();                        
        
    }          

    function fn_initialize() {                        
        parent::fn_initialize();                                
    }
    
    //START CALL AUTOFORM FUNCTIONS/////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////

    function fn_pushColumnzSystem($obj_paramView){                                  

        if($obj_paramView->MetaUserSystemId===100){        
            return false;
        }

        //$this->fn_addMessage("fn_pushColumnzSystem");
        
        if(empty($obj_paramView->ValidView)){
            $this->fn_addConsole("VALID VIEW IS FALSE");                
            return false;
        }
        
        $obj_paramList=new stdClass;
        $obj_paramList->TABLE_SCHEMA="meta_column";                        
        $obj_paramList->TABLE_NAME="meta_column";                        
        $obj_paramList->REMOVE_LIST="'MetaColumnId', 'MetaColumnSystemId', 'PublishPin'";                        
        $str_listField=$this->fn_getColumnListNoPrimaryKey($obj_paramList);                      

        
        $str_listFieldName="`MetaColumnSystemId`,".$str_listField;
        $str_listFieldValue=$obj_paramView->MetaUserSystemId.",".$str_listField;                              

        
        //INSERT TARGET ROWS
        $str_sql="
        INSERT INTO `meta_column`.`meta_column`
        (
            $str_listFieldName
        )";                
        
        $str_sql.="SELECT $str_listFieldValue 
        FROM `meta_column`.`meta_column` WHERE TRUE         
        AND `MetaSchemaName`=:MetaSchemaName
        AND `MetaTableName`=:MetaTableName
        AND `MetaColumnSystemid`=100         
        AND `PublishPin`                
        AND CONCAT($obj_paramView->MetaUserSystemId, `MetaSchemaName`,`MetaTableName`,`MetaColumnName`) NOT IN (SELECT CONCAT(`MetaColumnSystemId`, `MetaSchemaName`,`MetaTableName`,`MetaColumnName`) FROM `meta_column`.`meta_column`)
        ;";        
        //$this->fn_addConsole("str_sql : ".$str_sql);
        $stmt=$this->fn_executeSQLStatement($str_sql, [                        
            'MetaSchemaName' => $obj_paramView->MetaSchemaName,
            'MetaTableName' => $obj_paramView->MetaTableName,
        ]);        
      
        $int_rowCount=$stmt->rowCount();
        $str_message=$int_rowCount." ROWS INSERTED [meta_column] [meta_column] FOR [".$this->obj_metaView->obj_param->MetaSchemaName."] [".$this->obj_metaView->obj_param->MetaTableName."]";
        //$this->fn_addEcho($str_message);
        
        //ADD META DATA TO EACH INSERTED TARGET ROW  
        $str_sql="
        SELECT * FROM `meta_column`.`meta_column`        
        WHERE TRUE         
        AND `MetaSchemaName`=:MetaSchemaName
        AND `MetaTableName`=:MetaTableName
        AND `MetaColumnSystemid`=:MetaUserSystemId
        ";        
        //$this->fn_addConsole("SELECT TARGET ROWS: ".$str_sql);                        
      
        $stmt=$this->fn_executeSQLStatement($str_sql, [                    
            "MetaSchemaName" => $obj_paramView->MetaSchemaName,
            "MetaTableName" => $obj_paramView->MetaTableName,
            "MetaUserSystemId" => $obj_paramView->MetaUserSystemId,            
        ]);
        $int_rowCount=$stmt->rowCount();
        $str_message=$int_rowCount." ROWS SELECTED [meta_column] [meta_column] FOR [".$obj_paramView->MetaSchemaName."] [".$obj_paramView->MetaTableName."]";
        //$this->fn_addConsole("str_message : ".$str_message);        
        $arr_rows=$stmt->fetchAll();      
        
        $obj_paramData=new stdClass;                  
        $obj_paramData->MetaDataSystemId=$obj_paramView->MetaUserSystemId;
        $obj_paramData->MetaDataOwnerId=$this->obj_userLogin->MetaUserId;//try and use the owner
        $obj_paramData->DataSchemaName="meta_column";
        $obj_paramData->DataTableName="meta_column";
        $obj_paramData->DataKeyName="MetaColumnId";              
        $obj_paramData->MetaPermissionTag="";        
        
        foreach ($arr_rows as $arr_row) {                    
            $obj_paramData->DataKeyValue=$arr_row["MetaColumnId"];
            
            $obj_metaData=new metaData($this);
            $int_idRecordMeta=$obj_metaData->fn_createRecord($obj_paramData);                                          
        }
        //ADD META DATA TO EACH INSERTED TARGET ROW          
      }

      function fn_checkMetaDataInsertRowz(){

        $obj_param=new stdClass();
        $obj_param->MetaUserSystemId=$this->obj_userLogin->MetaUserSystemId;
        $obj_param->DataSchemaName="meta_rowz";
        $obj_param->DataTableName="meta_rowz";
        $obj_param->DataKeyName="MetaRowzId";      
        $obj_param->MetaDataSystemConstraint="MetaRowzSystemId";                    
        $obj_param->MetaDataUserConstraint="MetaRowzUserId";                            
        $obj_param->MetaPermissionTag="";                
        $this->fn_checkMetaData($obj_param);
      }
  
      
      function fn_checkMetaData($obj_param){      

        $MetaUserSystemId=$obj_param->MetaUserSystemId;
        $MetaUserId=$this->obj_userLogin->MetaUserId;
        $DataSchemaName=$obj_param->DataSchemaName;
        $DataTableName=$obj_param->DataTableName;
        $DataKeyName=$obj_param->DataKeyName;              
        $MetaDataSystemConstraint=$obj_param->MetaDataSystemConstraint;                
        $MetaDataUserConstraint=$obj_param->MetaDataUserConstraint;        
        $MetaPermissionTag=$obj_param->MetaPermissionTag;                
        //CREATE DATA ENTRIES WHICH ARE MISSING FROM SYSTEM      
        $str_sql="
        SELECT * FROM  `$DataSchemaName`.`$DataTableName` WHERE TRUE 
        ";

        if(!empty($MetaDataSystemConstraint)){
            $str_sql.="AND `$MetaDataSystemConstraint`=$MetaUserSystemId ";
        }        
        if(!empty($MetaDataUserConstraint)){
            $str_sql.="AND `$MetaDataUserConstraint`=$MetaUserId";
        }        
        
        $str_sql.=";";                    
        $stmt=$this->fn_executeSQLStatement($str_sql);
        $arr_rows=$stmt->fetchAll();
        
        foreach ($arr_rows as $arr_row) {  
            $DataKeyValue=$arr_row[$DataKeyName];                                                          
            $obj_paramData=new stdClass;                  
            $obj_paramData->MetaDataSystemId=$MetaUserSystemId;      
            $obj_paramData->MetaDataOwnerId=$MetaUserId;      
            $obj_paramData->DataSchemaName=$DataSchemaName;
            $obj_paramData->DataTableName=$DataTableName;
            $obj_paramData->DataKeyName=$DataKeyName;      
            $obj_paramData->DataKeyValue=$DataKeyValue;               
            $obj_paramData->MetaPermissionTag=$MetaPermissionTag;                           
            
            $obj_metaData=new metaData($this);
            $obj_metaData->fn_createRecord($obj_paramData);                        
        } 
      }
      
      
      
      
      
      

  
}//END OF CLASS
?>