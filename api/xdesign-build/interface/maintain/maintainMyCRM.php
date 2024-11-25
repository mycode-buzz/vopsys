<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainMyCRM extends maintainPush{

    function fn_maintainMyCRM(){                 

      $obj_param=new stdClass;                        
      $obj_param->MetaViewSystemId=$this->obj_userLogin->MetaUserSystemId;                    
      $obj_param->MetaColumnSystemId=$this->obj_userLogin->MetaUserSystemId;
      $obj_param->MetaSchemaName="vm-crm";                   
      $obj_param->Subdomain="app";                         
      $this->fn_maintainMyCRMColumnz($obj_param);
    }

    function fn_maintainMyCRMColumnz($obj_param){                       
      
      //HouseKeeping Column Account
      $obj_param->MetaTableName="data_account";                   
      $MetaViewId=$this->fn_getMetaViewId($obj_param);

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `PublishPin`=1
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId      
      AND `MetaSchemaName`='$obj_param->MetaSchemaName'            
      ;";              
      $stmt=$this->fn_executeSQLStatement($str_sql);
      
      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `LivePin`=1
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId
      AND `MetaViewId`=$MetaViewId
      AND `MetaSchemaName`='$obj_param->MetaSchemaName'
      AND `MetaTableName`='$obj_param->MetaTableName'      
      AND `MetaColumnName`IN ('AddressLine','Note')
      ;";              
      $stmt=$this->fn_executeSQLStatement($str_sql);


      //HouseKeeping Column Activity
      $obj_param->MetaTableName="data_activity";                   
      $MetaViewId=$this->fn_getMetaViewId($obj_param);
      
      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `MenuPin`=0
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId
      AND `MetaViewId`=$MetaViewId
      AND `MetaSchemaName`='$obj_param->MetaSchemaName'
      AND `MetaTableName`='$obj_param->MetaTableName'      
      ;";        
      $stmt=$this->fn_executeSQLStatement($str_sql);
      
      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `MenuPin`=1
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId
      AND `MetaViewId`=$MetaViewId
      AND `MetaSchemaName`='$obj_param->MetaSchemaName'
      AND `MetaTableName`='$obj_param->MetaTableName'
      AND `MetaColumnName` IN ('ActivityDate','ActivityType')      
      ;";        
      $stmt=$this->fn_executeSQLStatement($str_sql);

      $str_sql="UPDATE `meta_column`.`meta_column` SET
      `LivePin`=1
      WHERE TRUE 
      AND `MetaColumnSystemId`=$obj_param->MetaColumnSystemId
      AND `MetaViewId`=$MetaViewId
      AND `MetaSchemaName`='$obj_param->MetaSchemaName'
      AND `MetaTableName`='$obj_param->MetaTableName'      
      AND `MetaColumnName`IN ('Description')
      ;";              
      $stmt=$this->fn_executeSQLStatement($str_sql);

    }

    
}