<?php

class pushColumnz extends interface_datafunction{

function fn_pushColumnz($MetaUserSystemId){ 

  //depreacated requires re development to push any new columns to exsiting users
  
  }
  function fn_getColumnListNoPrimaryKey($obj_param){        
  
    $REMOVE_LIST=$obj_param->REMOVE_LIST;
    //concat(\"'\",group_concat(COLUMN_NAME separator \"','\"),\"'\") AS `FieldList`
    //group_concat(COLUMN_NAME separator ',') AS `FieldList`
    $str_sql="SELECT         
    group_concat(COLUMN_NAME separator \"`,`\") AS `FieldList`
    FROM INFORMATION_SCHEMA.COLUMNS WHERE TRUE AND 
    TABLE_SCHEMA=:TABLE_SCHEMA AND 
    TABLE_NAME=:TABLE_NAME AND 
    COLUMN_NAME NOT IN ($obj_param->REMOVE_LIST)
    ;";           
    $str_listField=$this->fn_fetchColumn($str_sql, [            
        "TABLE_SCHEMA" => $obj_param->TABLE_SCHEMA,
        "TABLE_NAME" => $obj_param->TABLE_NAME            
    ]);               
  
  
    return "`".$str_listField."`";
  }
}//END OF CLASS
