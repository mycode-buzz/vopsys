<?php

/////////////////////////AUTHORISE
require_once dirname($_SERVER["DOCUMENT_ROOT"], 2)."/upgrade/xdesign-build/authorise.php";
/////////////////////////AUTHORISE

class maintainPush extends maintainOrphan{

    function fn_maintainPush(){        
        
        $this->fn_maintainPushColumnz();       
    }
    
    function fn_maintainPushColumnz(){                 

        $MetaUserSystemId=$this->obj_userLogin->MetaUserBaseId;
  
        $MetaViewId=$this->MetaPushViewId;        
        $this->fn_runMaintainPushColumnz($MetaViewId);
        
        $MetaViewId=$this->MetaPushDynamicViewId;        
        $this->fn_runMaintainPushColumnz($MetaViewId);
    }

    function fn_runMaintainPushColumnz($MetaViewId){                 

        $MetaUserSystemId=$this->obj_userLogin->MetaUserBaseId;

        $MetaSchemaName="meta_push";
        $MetaTableName="meta_push";        
  
        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `MenuPin`=1
        WHERE TRUE 
        AND `MetaColumnSystemId`=$MetaUserSystemId
        AND `MetaViewId`=$MetaViewId
        AND `MetaSchemaName`='$MetaSchemaName'
        AND `MetaTableName`='$MetaTableName'      
        AND `MetaColumnName`IN ('MetaPushId', 'ScriptDate','ScriptName','ScriptStatus')
        ;";              
        
        $stmt=$this->fn_executeSQLStatement($str_sql);
        
        $str_sql="UPDATE `meta_column`.`meta_column` SET
        `LivePin`=1
        WHERE TRUE 
        AND `MetaColumnSystemId`=$MetaUserSystemId
        AND `MetaViewId`=$MetaViewId
        AND `MetaSchemaName`='$MetaSchemaName'
        AND `MetaTableName`='$MetaTableName'      
        AND `MetaColumnName`IN ('ScriptValue')
        ;";              
        $stmt=$this->fn_executeSQLStatement($str_sql);
    }
  
  
    

    function betterEval($code) {
        $tmp = tmpfile ();
        $tmpf = stream_get_meta_data ( $tmp );
        $tmpf = $tmpf ['uri'];
        fwrite ( $tmp, $code );
        $ret = include ($tmpf);
        fclose ( $tmp );
        return $ret;
    }


    
}