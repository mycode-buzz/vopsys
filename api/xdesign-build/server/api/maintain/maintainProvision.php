<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/api/xdesign-build/server/api/authorise.php";
/////////////////////////AUTHORISE

class maintainDemo extends maintainSetup{
    function fn_provision(){  
        
        $this->fn_doProvision();
        $this->fn_setMessage("Provision is COMPLETE");        
    }

    
    function fn_doProvision(){               

        $MetaSchemaNameTemplate="data_000000100";
        $MetaTableNameTemplate="mybox_account";                
        $this->fn_resetAutoIncrement("`$MetaSchemaNameTemplate`.`$MetaTableNameTemplate`", "`Id`");

        $this->fn_clearTable("`meta_api`.`meta_api`", "`MetaAPIId`");
        $this->fn_clearTable("`meta_api`.`meta_api_system`", "`MetaAPIId`");        
        $this->fn_clearTable("`meta_history`.`meta_history`", "`MetaHistoryId`");        
        $this->fn_clearTable("`meta_user`.`meta_topup`", "`MetaTopupId`");        
        
        $MetaTableNameTarget="mybox_template";
        $this->fn_cloneDemo($MetaSchemaNameTemplate, $MetaTableNameTemplate, $MetaTableNameTarget);                
        $MetaTableNameTarget="mybox_activity";
        $this->fn_cloneDemo($MetaSchemaNameTemplate, $MetaTableNameTemplate, $MetaTableNameTarget);                
        $MetaTableNameTarget="mybox_contact";
        $this->fn_cloneDemo($MetaSchemaNameTemplate, $MetaTableNameTemplate, $MetaTableNameTarget);                
        $MetaTableNameTarget="mybox_opportunity";
        $this->fn_cloneDemo($MetaSchemaNameTemplate, $MetaTableNameTemplate, $MetaTableNameTarget);                
        $MetaTableNameTarget="mybox_tag";
        $this->fn_cloneDemo($MetaSchemaNameTemplate, $MetaTableNameTemplate, $MetaTableNameTarget);                
        $MetaTableNameTarget="mybox_task";
        $this->fn_cloneDemo($MetaSchemaNameTemplate, $MetaTableNameTemplate, $MetaTableNameTarget);
    }

    function fn_clearTable($str_source, $str_key){        
        $str_sql="DELETE FROM $str_source;";
        $stmt=$this->fn_executeSQLStatement($str_sql);
        $this->fn_resetAutoIncrement($str_source, $str_key);
    }

    function fn_cloneDemo($MetaSchemaNameTemplate, $MetaTableNameTemplate, $MetaTableNameTarget){       
        
        $str_sql="DELETE FROM `meta_column`.`meta_column` WHERE `MetaColumnSystemId`=100 AND `MetaSchemaName`='$MetaSchemaNameTemplate' AND `MetaTableName`='$MetaTableNameTarget';";
        $stmt=$this->fn_executeSQLStatement($str_sql);        
        $str_sql="DROP TABLE IF EXISTS `$MetaSchemaNameTemplate`.`$MetaTableNameTarget`;";
        $stmt=$this->fn_executeSQLStatement($str_sql);        
        $str_sql="CREATE TABLE `$MetaSchemaNameTemplate`.`$MetaTableNameTarget` LIKE `$MetaSchemaNameTemplate`.`$MetaTableNameTemplate`;";
        $stmt=$this->fn_executeSQLStatement($str_sql);        
        $str_sql="ALTER TABLE `meta_column`.`meta_column` AUTO_INCREMENT=1;";
        $stmt=$this->fn_executeSQLStatement($str_sql);                
        
        $obj_paramList=new stdClass;
        $obj_paramList->TABLE_SCHEMA="meta_column";
        $obj_paramList->TABLE_NAME="meta_column";
        $obj_paramList->REMOVE_LIST="'MetaColumnId', 'ABC', 'DEF'";                        
        $str_listField=$this->fn_getColumnListNoPrimaryKey($obj_paramList);                      
        $str_listFieldName=$str_listField;
        $str_listFieldValue=str_replace("`MetaTableName`", "'$MetaTableNameTarget'", $str_listField);
        
        $str_sql="INSERT INTO `meta_column`.`meta_column` ($str_listFieldName) SELECT $str_listFieldValue FROM `meta_column`.`meta_column` 
        WHERE TRUE
        AND `MetaColumnSystemId`=100        
        AND `MetaSchemaName`='$MetaSchemaNameTemplate'        
        AND `MetaTableName`='$MetaTableNameTemplate'        
        ORDER BY `MetaSchemaName`, `MetaTableName`, `FormOrder`, `MetaLabel`
        ;";                                 
        //$this->fn_varDump($str_sql, "str_sql");
        $stmt=$this->fn_executeSQLStatement($str_sql);        
          
    }

    

}