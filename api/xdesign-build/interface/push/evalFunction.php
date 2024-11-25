<?php

class evalFunction extends interface_support{

    function fn_evalCode($MetaUserSystemId, $ScriptValue){

        $this->fn_addEcho("fn_evalCode MetaUserSystemId: ".$MetaUserSystemId);
        $this->fn_addEcho("fn_evalCode ScriptValue: ".$ScriptValue);        
    
        eval($ScriptValue);
    }

    function fn_test(){

        $str_sql="ALTER TABLE `vm-crm`.`data_account` 
        CHANGE COLUMN `accounting_reference_code` `accounting_reference` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT '' ;";
        $stmt=$this->fn_executeSQLStatement($str_sql, [            
        ]);                              


        
      

    }
    
}