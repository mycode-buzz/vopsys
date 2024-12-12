<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

class maintainXDezign extends maintainMyCRM{

    function fn_maintainXDezign(){ 

      $str_sql="UPDATE `meta_column`.`meta_column` SET `InfoPin`=0, `MenuPin`=0 
      WHERE TRUE      
      AND `MetaSchemaName`=:MetaSchemaName
      AND `MetaTableName`=:MetaTableName            
      ;`";                    
      $this->fn_executeSQLStatement($str_sql, [
        "MetaSchemaName"=>"vm-xdesign",
        "MetaTableName"=>"xdesign_instance",
      ]);


      $str_sql="UPDATE `meta_column`.`meta_column`  SET `InfoPin`=1 
      WHERE TRUE
      AND `MetaColumnName`IN('EditPin','EditPinRelease') 
      AND `MetaSchemaName`=:MetaSchemaName
      AND `MetaTableName`=:MetaTableName      
      ";                    
      $this->fn_executeSQLStatement($str_sql, [
        "MetaSchemaName"=>"vm-xdesign",
        "MetaTableName"=>"xdesign_instance",
      ]);

      $str_sql="UPDATE `meta_column`.`meta_column`  SET `MenuPin`=1 
      WHERE TRUE
      AND `MetaColumnName`IN('CategoryName') 
      AND `MetaSchemaName`=:MetaSchemaName
      AND `MetaTableName`=:MetaTableName      
      ";                    
      $this->fn_executeSQLStatement($str_sql, [
        "MetaSchemaName"=>"vm-xdesign",
        "MetaTableName"=>"xdesign_instance",
      ]);
      
      $str_sql="UPDATE `meta_column`.`meta_column` SET `MenuPin`=1 WHERE TRUE
      AND `MetaColumnName` IN('id','Type','LastVersionDate','Name', 'NameShort') 
      AND `MetaViewId` IN(120,125)";                    
      //$this->fn_executeSQLStatement($str_sql);        

      //check meta data

      $obj_param=new stdClass();      
      $obj_param->MetaUserSystemId=100;
      $obj_param->DataSchemaName="vm-xdesign";
      $obj_param->DataTableName="xdesign_instance";
      $obj_param->DataKeyName="id";      
      $obj_param->MetaDataSystemConstraint="";                  
      $obj_param->MetaDataUserConstraint="";                        
      $obj_param->MetaPermissionTag="";              
      $this->fn_checkMetaDataSystem($obj_param);
    }
    

}