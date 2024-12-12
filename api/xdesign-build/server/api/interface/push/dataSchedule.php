<?php

class dataSchedule extends pushColumnz{

  function fn_getSystemIdEnd(){

    $str_sql="SELECT MetaSystemId FROM `meta_user`.`meta_system` WHERE TRUE      
    ORDER BY `MetaSystemId` DESC
    LIMIT 1
    ;";
    //$this->fn_addEcho("fn_getSystemIdEnd str_sql: ".$str_sql);
    return $this->fn_fetchColumn($str_sql);            

  }

  function fn_getSystemIdNext($SystemIdCurrent){

    $str_sql="SELECT MetaSystemId FROM `meta_user`.`meta_system` WHERE TRUE
    AND MetaSystemId<>100
    AND MetaSystemId>=$SystemIdCurrent+1
    ORDER BY `MetaSystemId` ASC
    LIMIT 1
    ;";
    //$this->fn_addEcho("fn_getSystemIdNext str_sql: ".$str_sql);
    return $this->fn_fetchColumn($str_sql);            

  }

  function fn_updateScriptDate($MetaPushId){

    $str_sql="UPDATE `meta_push`.`meta_push` 
    SET
    `ScriptDate`=DATE_SUB(NOW(), INTERVAL 1 MINUTE)
    WHERE TRUE
    AND MetaPushId=$MetaPushId;      
    ;";
    //$this->fn_addEcho("fn_updateScriptDate str_sql: ".$str_sql);
    $stmt=$this->fn_executeSQLStatement($str_sql);      
  }

  
  function fn_updateScriptStatus($MetaPushId, $ScriptStatus){

      $str_sql="UPDATE `meta_push`.`meta_push` 
      SET
      `ScriptStatus`='$ScriptStatus'
      WHERE TRUE
      AND MetaPushId=$MetaPushId;      
      ;";
      //$this->fn_addEcho("fn_updateScriptStatus str_sql: ".$str_sql);
      $stmt=$this->fn_executeSQLStatement($str_sql);
    }

  function fn_updateSystemIdCurrent($MetaPushId, $SystemIdNew){

    $str_sql="UPDATE `meta_push`.`meta_push` 
    SET
    `SystemIdCurrent`=$SystemIdNew      
    WHERE TRUE
    AND MetaPushId=$MetaPushId;      
    ;";
    
    //$this->fn_addEcho("fn_updateSystemIdCurrent str_sql: ".$str_sql);
    $stmt=$this->fn_executeSQLStatement($str_sql);
  }
  function fn_updateSystemIdTo($MetaPushId, $SystemIdNew){

    $str_sql="UPDATE `meta_push`.`meta_push` 
    SET
    `SystemIdTo`=$SystemIdNew      
    WHERE TRUE
    AND MetaPushId=$MetaPushId;      
    ;";
    
    //$this->fn_addEcho("fn_updateSystemIdCurrent str_sql: ".$str_sql);
    $stmt=$this->fn_executeSQLStatement($str_sql);
  }
 
}